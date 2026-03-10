#!/usr/bin/env python3
"""
Markdown 转 Word 转换器
使用 markdown + python-docx 库
"""

import markdown
import re
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
import sys
import os

def md_to_docx(md_file, docx_file):
    """将 Markdown 文件转换为 Word 文档"""
    
    # 读取 Markdown 内容
    with open(md_file, 'r', encoding='utf-8') as f:
        md_content = f.read()
    
    # 创建 Word 文档
    doc = Document()
    
    # 设置中文字体
    doc.styles['Normal'].font.name = 'Microsoft YaHei'
    doc.styles['Normal']._element.rPr.rFonts.set(qn('w:eastAsia'), 'Microsoft YaHei')
    
    # 解析 Markdown 行
    lines = md_content.split('\n')
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # 标题
        if line.startswith('# '):
            p = doc.add_heading(line[2:], level=1)
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        elif line.startswith('## '):
            doc.add_heading(line[3:], level=2)
        elif line.startswith('### '):
            doc.add_heading(line[4:], level=3)
        elif line.startswith('#### '):
            doc.add_heading(line[5:], level=4)
        
        # 表格
        elif line.startswith('|') and i + 1 < len(lines) and '---' in lines[i + 1]:
            # 解析表格
            headers = [cell.strip() for cell in line.split('|')[1:-1]]
            i += 2  # 跳过表头分隔行
            
            table = doc.add_table(rows=1, cols=len(headers))
            table.style = 'Light Grid Accent 1'
            
            # 表头
            hdr_cells = table.rows[0].cells
            for j, header in enumerate(headers):
                hdr_cells[j].text = header
            
            # 数据行
            while i < len(lines) and lines[i].startswith('|'):
                row_cells = table.add_row().cells
                cells = [cell.strip() for cell in lines[i].split('|')[1:-1]]
                for j, cell in enumerate(cells):
                    if j < len(row_cells):
                        row_cells[j].text = cell
                i += 1
            continue
        
        # 代码块
        elif line.startswith('```'):
            code_lines = []
            i += 1
            while i < len(lines) and not lines[i].startswith('```'):
                code_lines.append(lines[i])
                i += 1
            code_text = '\n'.join(code_lines)
            p = doc.add_paragraph()
            run = p.add_run(code_text)
            run.font.name = 'Consolas'
            run.font.size = Pt(9)
            run.font.color.rgb = RGBColor(50, 50, 50)
        
        # 列表
        elif line.startswith('- ') or line.startswith('* '):
            doc.add_paragraph(line[2:], style='List Bullet')
        elif re.match(r'^\d+\. ', line):
            doc.add_paragraph(re.sub(r'^\d+\. ', '', line), style='List Number')
        
        # 普通段落
        elif line.strip():
            # 处理加粗和斜体
            text = line
            text = re.sub(r'\*\*\*(.+?)\*\*\*', r'\1', text)  # 粗斜体
            text = re.sub(r'\*\*(.+?)\*\*', r'\1', text)      # 粗体
            text = re.sub(r'\*(.+?)\*', r'\1', text)          # 斜体
            text = re.sub(r'`(.+?)`', r'\1', text)            # 行内代码
            
            if text.strip():
                doc.add_paragraph(text)
        
        # 空行
        else:
            pass
        
        i += 1
    
    # 保存文档
    doc.save(docx_file)
    print(f"✓ 转换完成: {docx_file}")

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("用法: python md2docx.py <input.md> <output.docx>")
        sys.exit(1)
    
    md_file = sys.argv[1]
    docx_file = sys.argv[2]
    
    if not os.path.exists(md_file):
        print(f"错误: 文件不存在 {md_file}")
        sys.exit(1)
    
    md_to_docx(md_file, docx_file)