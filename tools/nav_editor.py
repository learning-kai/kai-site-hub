"""Tkinter editor for the top navigation config."""

from __future__ import annotations

import copy
import json
import re
import socket
import subprocess
import tkinter as tk
import urllib.error
import urllib.request
import webbrowser
from pathlib import Path
from tkinter import messagebox, ttk


ROOT_DIR = Path(__file__).resolve().parents[1]
CONFIG_PATH = ROOT_DIR / "src" / "nav.config.json"
HTTP_URL_RE = re.compile(r"^https?://\S+$", re.IGNORECASE)
PREVIEW_HOST = "127.0.0.1"
PREVIEW_PORT = 4173
PREVIEW_URL = f"http://{PREVIEW_HOST}:{PREVIEW_PORT}/"
PREVIEW_TITLE = "Kai Site Hub"


def load_config(path: Path = CONFIG_PATH) -> dict:
  with path.open("r", encoding="utf-8") as file:
    return json.load(file)


def save_config(config: dict, path: Path = CONFIG_PATH) -> None:
  with path.open("w", encoding="utf-8") as file:
    json.dump(config, file, ensure_ascii=False, indent=2)
    file.write("\n")


def is_port_open(host: str = PREVIEW_HOST, port: int = PREVIEW_PORT) -> bool:
  with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
    sock.settimeout(0.35)
    return sock.connect_ex((host, port)) == 0


def preview_matches_project(url: str = PREVIEW_URL) -> bool:
  try:
    with urllib.request.urlopen(url, timeout=1.5) as response:
      html = response.read(12000).decode("utf-8", errors="ignore")
  except (OSError, urllib.error.URLError):
    return False
  return PREVIEW_TITLE in html


def validate_config(config: dict) -> list[str]:
  errors: list[str] = []
  seen_ids: set[str] = set()

  home_href = config.get("home", {}).get("href", "").strip()
  if not HTTP_URL_RE.match(home_href):
    errors.append("home.href 必须是 http:// 或 https:// 开头的 URL。")

  def validate_label(item: dict, path: str) -> None:
    label = item.get("label", {})
    if not str(label.get("zh", "")).strip():
      errors.append(f"{path} 的中文名称不能为空。")
    if not str(label.get("en", "")).strip():
      errors.append(f"{path} 的英文名称不能为空。")

  def validate_id(item: dict, path: str) -> None:
    item_id = str(item.get("id", "")).strip()
    if not item_id:
      errors.append(f"{path} 的 id 不能为空。")
      return
    if item_id in seen_ids:
      errors.append(f"{path} 的 id 重复：{item_id}。")
      return
    seen_ids.add(item_id)

  def validate_link(item: dict, path: str) -> None:
    href = str(item.get("href", "")).strip()
    if not HTTP_URL_RE.match(href):
      errors.append(f"{path} 的 URL 必须是 http:// 或 https:// 开头。")

  for index, item in enumerate(config.get("items", []), start=1):
    item_path = f"顶部第 {index} 项"
    item_type = item.get("type")
    validate_id(item, item_path)
    validate_label(item, item_path)

    if item_type == "link":
      validate_link(item, item_path)
    elif item_type == "dropdown":
      children = item.get("items", [])
      if not children:
        errors.append(f"{item_path} 是下拉菜单，至少需要一个子项。")
      for child_index, child in enumerate(children, start=1):
        child_path = f"{item_path} 的第 {child_index} 个子项"
        validate_id(child, child_path)
        validate_label(child, child_path)
        validate_link(child, child_path)
    else:
      errors.append(f"{item_path} 的类型必须是 link 或 dropdown。")

  return errors


def make_link(item_id: str, href: str, zh: str, en: str, key: str = "") -> dict:
  item = {
    "type": "link",
    "id": item_id.strip(),
    "href": href.strip(),
    "label": {
      "zh": zh.strip(),
      "en": en.strip(),
    },
  }
  if key.strip():
    item["key"] = key.strip()
  return item


def make_dropdown(item_id: str, zh: str, en: str, items: list[dict] | None = None) -> dict:
  return {
    "type": "dropdown",
    "id": item_id.strip(),
    "label": {
      "zh": zh.strip(),
      "en": en.strip(),
    },
    "items": items or [],
  }


class ItemDialog(tk.Toplevel):
  def __init__(self, parent: tk.Tk, title: str, item: dict | None, allow_dropdown: bool):
    super().__init__(parent)
    self.title(title)
    self.resizable(False, False)
    self.result: dict | None = None
    self.transient(parent)
    self.grab_set()

    item = copy.deepcopy(item) if item else None
    item_type = item.get("type", "link") if item else "link"

    self.type_var = tk.StringVar(value=item_type)
    self.id_var = tk.StringVar(value=item.get("id", "") if item else "")
    self.zh_var = tk.StringVar(value=item.get("label", {}).get("zh", "") if item else "")
    self.en_var = tk.StringVar(value=item.get("label", {}).get("en", "") if item else "")
    self.href_var = tk.StringVar(value=item.get("href", "") if item else "")
    self.key_var = tk.StringVar(value=item.get("key", "") if item else "")
    self.child_items = item.get("items", []) if item and item_type == "dropdown" else []

    body = ttk.Frame(self, padding=14)
    body.grid(row=0, column=0, sticky="nsew")

    ttk.Label(body, text="类型").grid(row=0, column=0, sticky="w", pady=4)
    type_box = ttk.Frame(body)
    type_box.grid(row=0, column=1, sticky="w", pady=4)
    ttk.Radiobutton(type_box, text="直接链接", variable=self.type_var, value="link", command=self._sync_fields).pack(side=tk.LEFT)
    dropdown_radio = ttk.Radiobutton(type_box, text="下拉菜单", variable=self.type_var, value="dropdown", command=self._sync_fields)
    dropdown_radio.pack(side=tk.LEFT, padx=(10, 0))
    if not allow_dropdown:
      dropdown_radio.state(["disabled"])

    self._entry(body, "ID", self.id_var, 1)
    self._entry(body, "中文名称", self.zh_var, 2)
    self._entry(body, "英文名称", self.en_var, 3)
    self.href_label, self.href_entry = self._entry(body, "URL", self.href_var, 4)
    self.key_label, self.key_entry = self._entry(body, "CTA key（可选）", self.key_var, 5)

    buttons = ttk.Frame(body)
    buttons.grid(row=6, column=0, columnspan=2, sticky="e", pady=(14, 0))
    ttk.Button(buttons, text="取消", command=self.destroy).pack(side=tk.RIGHT)
    ttk.Button(buttons, text="确定", command=self._submit).pack(side=tk.RIGHT, padx=(0, 8))

    self._sync_fields()
    self.bind("<Return>", lambda _event: self._submit())
    self.bind("<Escape>", lambda _event: self.destroy())
    self.wait_window(self)

  def _entry(self, parent: ttk.Frame, label: str, variable: tk.StringVar, row: int) -> tuple[ttk.Label, ttk.Entry]:
    label_widget = ttk.Label(parent, text=label)
    label_widget.grid(row=row, column=0, sticky="w", pady=4)
    entry = ttk.Entry(parent, textvariable=variable, width=42)
    entry.grid(row=row, column=1, sticky="ew", pady=4)
    return label_widget, entry

  def _sync_fields(self) -> None:
    is_dropdown = self.type_var.get() == "dropdown"
    state = "disabled" if is_dropdown else "normal"
    self.href_entry.configure(state=state)
    self.key_entry.configure(state=state)
    self.href_label.configure(foreground="#777" if is_dropdown else "")
    self.key_label.configure(foreground="#777" if is_dropdown else "")

  def _submit(self) -> None:
    item_type = self.type_var.get()
    if item_type == "dropdown":
      self.result = make_dropdown(self.id_var.get(), self.zh_var.get(), self.en_var.get(), self.child_items)
    else:
      self.result = make_link(
        self.id_var.get(),
        self.href_var.get(),
        self.zh_var.get(),
        self.en_var.get(),
        self.key_var.get(),
      )
    self.destroy()


class NavEditor(tk.Tk):
  def __init__(self) -> None:
    super().__init__()
    self.title("顶部导航编辑器")
    self.geometry("980x560")
    self.minsize(760, 460)
    self.config_data = load_config()
    self.dirty = False
    self.preview_process: subprocess.Popen | None = None
    self._build_ui()
    self.refresh_tree()

  def _build_ui(self) -> None:
    root = ttk.Frame(self, padding=12)
    root.pack(fill=tk.BOTH, expand=True)

    home_frame = ttk.LabelFrame(root, text="主页链接", padding=10)
    home_frame.pack(fill=tk.X)
    self.home_var = tk.StringVar(value=self.config_data["home"]["href"])
    self.home_var.trace_add("write", lambda *_args: self._mark_dirty("主页链接已修改，点击“保存”写入配置。"))
    ttk.Entry(home_frame, textvariable=self.home_var).pack(fill=tk.X)

    actions = ttk.Frame(root)
    actions.pack(fill=tk.X, pady=(12, 0))
    ttk.Button(actions, text="增加网站", command=self.add_link).pack(side=tk.LEFT, padx=(0, 6))
    ttk.Button(actions, text="增加分类", command=self.add_dropdown).pack(side=tk.LEFT, padx=(0, 6))
    ttk.Button(actions, text="分类内增加网站", command=self.add_child_link).pack(side=tk.LEFT, padx=(0, 6))
    ttk.Separator(actions, orient=tk.VERTICAL).pack(side=tk.LEFT, fill=tk.Y, padx=(4, 10))
    ttk.Button(actions, text="编辑", command=self.edit_item).pack(side=tk.LEFT, padx=(0, 6))
    ttk.Button(actions, text="删除", command=self.delete_item).pack(side=tk.LEFT, padx=(0, 6))
    ttk.Button(actions, text="上移", command=lambda: self.move_item(-1)).pack(side=tk.LEFT, padx=(0, 6))
    ttk.Button(actions, text="下移", command=lambda: self.move_item(1)).pack(side=tk.LEFT, padx=(0, 6))
    ttk.Separator(actions, orient=tk.VERTICAL).pack(side=tk.LEFT, fill=tk.Y, padx=(4, 10))
    ttk.Button(actions, text="保存", command=self.save).pack(side=tk.LEFT, padx=(0, 6))
    ttk.Button(actions, text="启动/打开预览", command=self.open_preview).pack(side=tk.LEFT, padx=(0, 6))
    ttk.Button(actions, text="重新加载", command=self.reload).pack(side=tk.LEFT)

    main = ttk.Frame(root)
    main.pack(fill=tk.BOTH, expand=True, pady=(12, 0))

    self.tree = ttk.Treeview(main, columns=("type", "zh", "en", "href"), show="tree headings", selectmode="browse")
    self.tree.heading("#0", text="ID")
    self.tree.heading("type", text="类型")
    self.tree.heading("zh", text="中文")
    self.tree.heading("en", text="英文")
    self.tree.heading("href", text="URL")
    self.tree.column("#0", width=150, minwidth=100)
    self.tree.column("type", width=70, minwidth=60, anchor=tk.CENTER)
    self.tree.column("zh", width=120, minwidth=80)
    self.tree.column("en", width=135, minwidth=90)
    self.tree.column("href", width=260, minwidth=160)
    self.tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)

    scrollbar = ttk.Scrollbar(main, orient=tk.VERTICAL, command=self.tree.yview)
    scrollbar.pack(side=tk.LEFT, fill=tk.Y)
    self.tree.configure(yscrollcommand=scrollbar.set)
    self.tree.bind("<Double-1>", lambda _event: self.edit_item())

    self.status_var = tk.StringVar(
      value="这里管理顶部网站跳转；点“增加网站”添加到最上方跳转行，新增/编辑后需要点击“保存”。"
    )
    ttk.Label(root, textvariable=self.status_var, foreground="#555").pack(fill=tk.X, pady=(10, 0))

  def refresh_tree(self) -> None:
    self.tree.delete(*self.tree.get_children())
    for index, item in enumerate(self.config_data["items"]):
      iid = self._tree_iid(index)
      self.tree.insert("", tk.END, iid=iid, text=item["id"], values=self._values(item), open=True)
      if item["type"] == "dropdown":
        for child_index, child in enumerate(item.get("items", [])):
          self.tree.insert(iid, tk.END, iid=self._tree_iid(index, child_index), text=child["id"], values=self._values(child))

  def add_link(self) -> None:
    dialog = ItemDialog(self, "增加网站", None, allow_dropdown=False)
    if dialog.result:
      self.config_data["items"].append(dialog.result)
      self.refresh_tree()
      self._select_path((len(self.config_data["items"]) - 1,))
      self._mark_dirty("已增加网站，点击“保存”后网页配置才会更新。")

  def add_dropdown(self) -> None:
    dialog = ItemDialog(self, "增加分类", make_dropdown("", "", ""), allow_dropdown=True)
    if dialog.result:
      self.config_data["items"].append(dialog.result)
      self.refresh_tree()
      self._select_path((len(self.config_data["items"]) - 1,))
      self._mark_dirty("已增加分类；保存前请至少添加一个网站。")

  def add_child_link(self) -> None:
    selected = self._selected_path()
    if selected is None:
      messagebox.showwarning("请选择分类", "先选中一个分类，再在分类内增加网站。")
      return

    parent_index = selected[0]
    parent_item = self.config_data["items"][parent_index]
    if parent_item["type"] != "dropdown":
      messagebox.showwarning("请选择分类", "分类内网站只能添加到分类里。")
      return

    dialog = ItemDialog(self, "分类内增加网站", None, allow_dropdown=False)
    if dialog.result:
      parent_item.setdefault("items", []).append(dialog.result)
      self.refresh_tree()
      self._select_path((parent_index, len(parent_item["items"]) - 1))
      self._mark_dirty("已在分类内增加网站，点击“保存”后网页配置才会更新。")

  def edit_item(self) -> None:
    selected = self._selected_path()
    if selected is None:
      messagebox.showwarning("请选择项目", "先选中要编辑的导航项。")
      return

    item = self._get_item(selected)
    allow_dropdown = len(selected) == 1
    dialog = ItemDialog(self, "编辑导航项", item, allow_dropdown=allow_dropdown)
    if dialog.result:
      self._set_item(selected, dialog.result)
      self.refresh_tree()
      self._select_path(selected)
      self._mark_dirty("已编辑导航项，点击“保存”后网页配置才会更新。")

  def delete_item(self) -> None:
    selected = self._selected_path()
    if selected is None:
      messagebox.showwarning("请选择项目", "先选中要删除的导航项。")
      return

    if not messagebox.askyesno("确认删除", "确定删除选中的导航项？"):
      return

    if len(selected) == 1:
      del self.config_data["items"][selected[0]]
    else:
      del self.config_data["items"][selected[0]]["items"][selected[1]]
    self.refresh_tree()
    self._mark_dirty("已删除导航项，点击“保存”后网页配置才会更新。")

  def move_item(self, offset: int) -> None:
    selected = self._selected_path()
    if selected is None:
      messagebox.showwarning("请选择项目", "先选中要移动的导航项。")
      return

    collection = self.config_data["items"]
    index = selected[0]
    if len(selected) == 2:
      collection = self.config_data["items"][selected[0]]["items"]
      index = selected[1]

    new_index = index + offset
    if new_index < 0 or new_index >= len(collection):
      return
    collection[index], collection[new_index] = collection[new_index], collection[index]
    self.refresh_tree()
    if len(selected) == 1:
      next_iid = self._tree_iid(new_index)
    else:
      next_iid = self._tree_iid(selected[0], new_index)
    self._select_iid(next_iid)
    self._mark_dirty("已调整顺序，点击“保存”后网页配置才会更新。")

  def save(self) -> None:
    self.config_data["home"]["href"] = self.home_var.get().strip()
    errors = validate_config(self.config_data)
    if errors:
      messagebox.showerror("校验失败", "\n".join(errors))
      self.status_var.set("保存失败：请按弹窗修正配置。")
      return
    save_config(self.config_data)
    self.dirty = False
    self.status_var.set(f"保存成功。请打开或刷新 {PREVIEW_URL}；如果看 dist，请重新运行 npm run build。")
    messagebox.showinfo(
      "保存成功",
      f"已保存到 {CONFIG_PATH}\n\n请打开或刷新 {PREVIEW_URL}。\n如果看 dist 打包结果，需要重新运行 npm run build。",
    )

  def open_preview(self) -> None:
    if is_port_open():
      if preview_matches_project():
        webbrowser.open(PREVIEW_URL)
        self.status_var.set(f"已打开本项目预览：{PREVIEW_URL}")
      else:
        messagebox.showerror(
          "端口被占用",
          f"{PREVIEW_URL} 正在运行，但不是 {PREVIEW_TITLE}。\n请关闭占用 4173 的其它服务后再试。",
        )
        self.status_var.set("4173 端口被其它项目占用，无法确认预览。")
      return

    try:
      self.preview_process = subprocess.Popen(
        ["npm.cmd", "run", "dev", "--", "--port", str(PREVIEW_PORT)],
        cwd=ROOT_DIR,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0),
      )
    except OSError as error:
      messagebox.showerror("启动失败", f"无法启动预览服务：\n{error}")
      self.status_var.set("启动预览失败，请检查 npm 是否可用。")
      return

    self.after(900, self._open_preview_when_ready, 1)
    self.status_var.set(f"正在启动本项目预览：{PREVIEW_URL}")

  def _open_preview_when_ready(self, attempt: int) -> None:
    if preview_matches_project():
      webbrowser.open(PREVIEW_URL)
      self.status_var.set(f"已启动并打开本项目预览：{PREVIEW_URL}")
      return

    if attempt >= 8:
      messagebox.showwarning(
        "预览未就绪",
        f"已尝试启动预览，但暂时无法确认页面。\n请手动打开 {PREVIEW_URL} 或查看命令行错误。",
      )
      self.status_var.set("预览服务启动超时，请检查 npm run dev 是否报错。")
      return

    self.after(650, self._open_preview_when_ready, attempt + 1)

  def reload(self) -> None:
    self.config_data = load_config()
    self.home_var.set(self.config_data["home"]["href"])
    self.dirty = False
    self.refresh_tree()
    self.status_var.set("已重新加载配置。")

  def _values(self, item: dict) -> tuple[str, str, str, str]:
    return (
      "下拉" if item["type"] == "dropdown" else "链接",
      item.get("label", {}).get("zh", ""),
      item.get("label", {}).get("en", ""),
      item.get("href", ""),
    )

  def _selected_path(self) -> tuple[int] | tuple[int, int] | None:
    selected = self.tree.selection()
    if not selected:
      return None
    parts = selected[0].split(":")
    if len(parts) == 1:
      return (int(parts[0]),)
    return (int(parts[0]), int(parts[1]))

  def _get_item(self, path: tuple[int] | tuple[int, int]) -> dict:
    if len(path) == 1:
      return self.config_data["items"][path[0]]
    return self.config_data["items"][path[0]]["items"][path[1]]

  def _set_item(self, path: tuple[int] | tuple[int, int], item: dict) -> None:
    if len(path) == 1:
      self.config_data["items"][path[0]] = item
    else:
      self.config_data["items"][path[0]]["items"][path[1]] = item

  def _mark_dirty(self, message: str) -> None:
    self.dirty = True
    self.status_var.set(message)

  def _select_path(self, path: tuple[int] | tuple[int, int]) -> None:
    if len(path) == 1:
      self._select_iid(self._tree_iid(path[0]))
    else:
      self._select_iid(self._tree_iid(path[0], path[1]))

  def _select_iid(self, iid: str) -> None:
    self.tree.selection_set(iid)
    self.tree.focus(iid)
    self.tree.see(iid)

  def _tree_iid(self, index: int, child_index: int | None = None) -> str:
    if child_index is None:
      return str(index)
    return f"{index}:{child_index}"


def main() -> None:
  app = NavEditor()
  app.mainloop()


if __name__ == "__main__":
  main()
