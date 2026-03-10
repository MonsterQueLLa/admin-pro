# 文档交付说明

## 已生成文档

| 文档 | 路径 | 说明 |
|------|------|------|
| 需求规格说明书 | `docs/01-需求规格说明书.md` | 功能需求、原型设计 |
| 技术方案文档 | `docs/02-技术方案文档.md` | 架构设计、接口规范 |

## 转换为 Word 的方法

### 方法 1：使用 Pandoc（推荐）

```bash
# 安装 Pandoc: https://pandoc.org/installing.html

# 转换为 Word
cd F:\Projects\admin-system\docs

pandoc "01-需求规格说明书.md" -o "01-需求规格说明书.docx" \
  --reference-doc=template.docx \
  --toc \
  --toc-depth=3

pandoc "02-技术方案文档.md" -o "02-技术方案文档.docx" \
  --reference-doc=template.docx \
  --toc \
  --toc-depth=3
```

### 方法 2：使用 Typora

1. 打开 Markdown 文件
2. 文件 → 导出 → Word (.docx)
3. 选择样式模板

### 方法 3：使用 VS Code + 插件

安装 **Markdown to Word** 插件，右键导出。

## 配图说明

文档中的架构图、流程图使用 ASCII 字符绘制，转换为 Word 后建议：

1. 使用 **Draw.io** 重新绘制精美图表
2. 或使用 **ProcessOn** 在线工具
3. 截图插入 Word 文档

## 下一步

主公审核文档后，可：
1. 提出修改意见
2. 确认后进入编码阶段
3. 或需要补充其他文档（如测试计划、部署手册）



## 数据库

![1773157203074](C:\Users\Jesen\AppData\Roaming\Typora\typora-user-images\1773157203074.png)

---

**文档状态**：待审核  
**创建时间**：2026-03-10 00:15