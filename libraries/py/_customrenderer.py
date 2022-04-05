# -*- coding: utf8 -*-

import dataclasses
import json
import logging
import os
import typing as t
from pathlib import Path

import databind.core.annotations as A
import docspec
import typing_extensions as te

from pydoc_markdown.interfaces import Renderer, Resolver, SinglePageRenderer
from pydoc_markdown.contrib.renderers.markdown import MarkdownRenderer

logger = logging.getLogger(__name__)


# https://github.com/NiklasRosenstein/pydoc-markdown/blob/83339893d403caa58c6810973efeb0415b0daa91/src/pydoc_markdown/contrib/renderers/markdown.py

@dataclasses.dataclass
class CustomizedMarkdownRenderer(MarkdownRenderer):
  """We override some defaults in this subclass. """

  #: Disabled because Docusaurus supports this automatically.
  insert_header_anchors: bool = False

  #: Escape html in docstring, otherwise it could lead to invalid html.
  escape_html_in_docstring: bool = True

  #: Conforms to Docusaurus header format.
  render_module_header_template: str = (
    '---\n'
    'sidebar_label: {relative_module_name}\n'
    'title: {module_name}\n'
    '---\n\n'
  )


@dataclasses.dataclass
class CustomRenderer(Renderer):
  """
  Produces Markdown files and a `sidebar.json` file for use in a [Docusaurus v2][1] websites.
  It creates files in a fixed layout that reflects the structure of the documented packages.
  The files will be rendered into the directory specified with the #docs_base_path option.

  Check out the complete [Docusaurus example on GitHub][2].

  [1]: https://v2.docusaurus.io/
  [2]: https://github.com/NiklasRosenstein/pydoc-markdown/tree/develop/examples/docusaurus

  ### Options
  """

  #: The #MarkdownRenderer configuration.
  markdown: te.Annotated[MarkdownRenderer, A.typeinfo(deserialize_as=CustomizedMarkdownRenderer)] = \
    dataclasses.field(default_factory=CustomizedMarkdownRenderer)

  #: The path where the docusaurus docs content is. Defaults "docs" folder.
  docs_base_path: str = 'docs'

  #: The output path inside the docs_base_path folder, used to ouput the
  #: module reference.
  relative_output_path: str = 'reference'

  #: The sidebar path inside the docs_base_path folder, used to ouput the
  #: sidebar for the module reference.
  relative_sidebar_path: str = 'sidebar.json'

  #: The top-level label in the sidebar. Default to 'Reference'. Can be set to null to
  #: remove the sidebar top-level all together. This option assumes that there is only one top-level module.
  sidebar_top_level_label: t.Optional[str] = 'Reference'

  #: The top-level module label in the sidebar. Default to null, meaning that the actual
  #: module name will be used. This option assumes that there is only one top-level module.
  sidebar_top_level_module_label: t.Optional[str] = None

  def render(self, modules: t.List[docspec.Module]) -> None:
    module_tree: t.Dict[str, t.Any] = {"children": {}, "edges": []}
    output_path = Path(self.docs_base_path) / self.relative_output_path
    for module in modules:
      filepath = output_path

      module_parts = module.name.split(".")
      if module.location.filename.endswith("__init__.py"):
        module_parts.append("__init__")

      relative_module_tree = module_tree
      intermediary_module = []

      for module_part in module_parts[:-1]:
        # update the module tree
        intermediary_module.append(module_part)
        intermediary_module_name = ".".join(intermediary_module)
        relative_module_tree["children"].setdefault(intermediary_module_name, {"children": {}, "edges": []})
        relative_module_tree = relative_module_tree["children"][intermediary_module_name]

        # descend to the file
        filepath = filepath / module_part

      # create intermediary missing directories and get the full path
      filepath.mkdir(parents=True, exist_ok=True)
      filepath = filepath / f"{module_parts[-1]}.md"

      with filepath.open('w') as fp:
        logger.info("Render file %s", filepath)
        self.render_single_page(fp, [module])

      # only update the relative module tree if the file is not empty
      relative_module_tree["edges"].append(
        os.path.splitext(str(filepath.relative_to(self.docs_base_path)))[0]
      )

    # self._render_side_bar_config(module_tree)


  def render_single_page(self, fp: t.TextIO, modules: t.List[docspec.Module], page_title: t.Optional[str] = None) -> None:
    self._resolver = MarkdownReferenceResolver(modules)
    if self.markdown.render_page_title:
      fp.write('# {}\n\n'.format(page_title))

    if self.markdown.render_toc:
      if self.markdown.render_toc_title:
        if self.markdown.render_page_title:
          # set to level2 since level1 is page title
          fp.write('## {}\n\n'.format(self.render_toc_title))
        else:
          fp.write('# {}\n\n'.format(self.render_toc_title))

      for m in modules:
        self._render_toc(fp, 0, m)
      fp.write('\n')
    for m in modules:
      self.markdown._render_recursive(fp, 1, m)



  def _render_object(self, fp, level, obj):
    if not isinstance(obj, docspec.Module) or self.render_module_header:
      self._render_header(fp, level, obj)
    url = self.source_linker.get_source_url(obj) if self.source_linker else None
    source_string = self.source_format.replace('{url}', str(url)) if url else None
    if source_string and self.source_position == 'before signature':
      fp.write(source_string + '\n\n')
    self._render_signature_block(fp, obj)
    if source_string and self.source_position == 'after signature':
      fp.write(source_string + '\n\n')
    if obj.docstring:
      docstring = html.escape(obj.docstring) if self.escape_html_in_docstring else obj.docstring
      lines = docstring.split('\n')
      if self.docstrings_as_blockquote:
        lines = ['> ' + x for x in lines]
      fp.write('\n'.join(lines))
      fp.write('\n\n')
    
  def _render_recursive(self, fp, level, obj):
    self._render_object(fp, level, obj)
    level += 1
    for member in getattr(obj, 'members', []):
      self._render_recursive(fp, level, member)
  
  def _get_title(self, obj: docspec.ApiObject) -> str:
    title = obj.name
    if (self.add_method_class_prefix and self._is_method(obj)) or \
       (self.add_member_class_prefix and isinstance(obj, docspec.Data)):
      title = self._get_parent(obj).name + '.' + title
    elif self.add_full_prefix and not self._is_method(obj):
      title = dotted_name(obj)
    if (not self.add_module_prefix and isinstance(obj, docspec.Module)):
      title = title.split('.')[-1]
    if isinstance(obj, docspec.Function):
      if self.signature_in_header:
        title += '(' + self._format_arglist(obj) + ')'

    if isinstance(obj, docspec.Data) and obj.datatype and self.render_typehint_in_data_header:
      if self.code_headers:
        title += f': {obj.datatype}'
      elif self.html_headers:
        title += f': <code>{obj.datatype}</code>'
      else:
        title += f': `{obj.datatype}`'

    if self.code_headers:
      if self.html_headers or self.sub_prefix:
        if self.sub_prefix and '.' in title:
          prefix, title = title.rpartition('.')[::2]
          title = '<sub>{}.</sub>{}'.format(prefix, title)
        title = '<code>{}</code>'.format(title)
      else:
        title = '`{}`'.format(title)
    elif not self.html_headers:
      title = self._escape(title)
    if isinstance(obj, docspec.Module) and self.descriptive_module_title:
      title = 'Module ' + title
    if isinstance(obj, docspec.Class) and self.descriptive_class_title:
      title += ' Objects'
    return title

  def _escape(self, s):
    return s.replace('_', '\\_').replace('*', '\\*')



  def render_to_string(self, modules: t.List[docspec.Module]) -> str:
    fp = io.StringIO()
    self.render_single_page(fp, modules)
    return fp.getvalue()

class MarkdownReferenceResolver(Resolver):

  def __init__(self, modules: t.List[docspec.ApiObject]) -> None:
    self.reverse_map = docspec.ReverseMap(modules)

  def generate_object_id(self, obj):
    parts = []
    while obj:
      parts.append(obj.name)
      obj = self.reverse_map.get_parent(obj)
    return '.'.join(reversed(parts))

  def _resolve_reference(self, obj: docspec.ApiObject, ref: t.List[str]) -> t.Optional[docspec.ApiObject]:
    for part_name in ref:
      obj = docspec.get_member(obj, part_name)
      if not obj:
        return None
    return obj

  def _find_reference(self, obj: docspec.ApiObject, ref: t.List[str]) -> t.Optional[docspec.ApiObject]:
    while obj:
      resolved = self._resolve_reference(obj, ref)
      if resolved:
        return resolved
      obj = self.reverse_map.get_parent(obj)
    return None

  def resolve_ref(self, obj: docspec.ApiObject, ref: str) -> t.Optional[str]:
    target = self._find_reference(obj, ref.split('.'))
    if target:
      return '#' + self.generate_object_id(target)
    return None