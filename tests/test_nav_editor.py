import copy
import tkinter as tk
import unittest

from tools.nav_editor import (
  PREVIEW_TITLE,
  ItemDialog,
  load_config,
  preview_matches_project,
  validate_config,
)


class NavEditorValidationTest(unittest.TestCase):
  def setUp(self):
    self.config = load_config()

  def test_current_config_is_valid(self):
    self.assertEqual(validate_config(self.config), [])

  def test_rejects_duplicate_ids(self):
    config = copy.deepcopy(self.config)
    config["items"][1]["id"] = config["items"][0]["items"][0]["id"]

    errors = validate_config(config)

    self.assertTrue(any("id 重复" in error for error in errors))

  def test_rejects_invalid_url(self):
    config = copy.deepcopy(self.config)
    config["items"][1]["href"] = "javascript:alert(1)"

    errors = validate_config(config)

    self.assertTrue(any("URL 必须是 http:// 或 https:// 开头" in error for error in errors))

  def test_rejects_empty_dropdown(self):
    config = copy.deepcopy(self.config)
    config["items"][0]["items"] = []

    errors = validate_config(config)

    self.assertTrue(any("至少需要一个子项" in error for error in errors))

  def test_preview_check_returns_false_for_unreachable_url(self):
    self.assertFalse(preview_matches_project("http://127.0.0.1:9/"))

  def test_preview_title_constant_matches_app(self):
    self.assertEqual(PREVIEW_TITLE, "Kai Site Hub")

  def test_item_dialog_does_not_overwrite_tk_children_registry(self):
    root = tk.Tk()
    root.withdraw()
    dialog = ItemDialog.__new__(ItemDialog)
    tk.Toplevel.__init__(dialog, root)
    dialog.child_items = []
    tk.Frame(dialog)

    self.assertIsInstance(dialog.children, dict)

    dialog.destroy()
    root.destroy()


if __name__ == "__main__":
  unittest.main()
