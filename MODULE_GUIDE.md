# 模块化架构指南
## 🏗️ 项目架构

项目已按照功能进行模块化重构，将原本的单体转换器拆分为独立的模块，提高代码的可维护性和扩展性。

## 📁 目录结构

```
libs/
├── content-cleaner.js     # 内容清理器
├── list-processor.js     # 列表处理器
├── table-processor.js    # 表格处理器
└── html-to-markdown.js  # HTML到Markdown转换器主模块
```

## 🧩 模块说明

### 1. ContentCleaner (内容清理器)
**文件**: `libs/content-cleaner.js`

**功能**:
- HTML标签清理
- HTML实体解码
- 特殊字符转义
- 空白字符处理

**主要方法**:
```javascript
static cleanListItemContent(content)     // 清理列表项内容
static cleanTableCellContent(cellHtml)  // 清理表格单元格内容
static decodeHtmlEntities(content)      // 解码HTML实体
static removeHtmlTags(content)         // 移除HTML标签
static cleanExtraLineBreaks(content)  // 清理多余空行
```

### 2. ListProcessor (列表处理器)
**文件**: `libs/list-processor.js`

**功能**:
- 处理有序列表
- 处理无序列表
- 列表项内容提取和清理

**主要方法**:
```javascript
static processUnorderedList(htmlList)    // 处理无序列表
static processOrderedList(htmlList)      // 处理有序列表
static extractListItemContent(listItem)   // 提取列表项内容
static isValidList(content)             // 验证列表HTML
```

### 3. TableProcessor (表格处理器)
**文件**: `libs/table-processor.js`

**功能**:
- HTML表格解析
- 表格行和单元格提取
- 表格格式转换
- 复杂表格支持

**主要方法**:
```javascript
static processTable(htmlTable)          // 处理HTML表格
static extractTableRows(tableHtml)     // 提取表格行
static convertToMarkdownTable(rows)   // 转换为Markdown表格
static getColumnCount(tableHtml)      // 获取列数
static hasHeader(tableHtml)           // 检查是否有表头
```

### 4. HtmlToMarkdownConverter (主转换器)
**文件**: `libs/html-to-markdown.js`

**功能**:
- 协调所有转换模块
- HTML到Markdown的完整转换流程
- 转换统计和验证

**主要方法**:
```javascript
static convert(html)                      // 主转换方法
static convertHeadings(html)               // 转换标题
static convertTextFormatting(html)          // 转换文本格式
static convertLinks(html)                  // 转换链接
static convertImages(html)                 // 转换图片
static convertCodeBlocks(html)              // 转换代码块
static convertParagraphs(html)             // 转换段落
static convertLineBreaks(html)              // 转换换行
static convertTables(html)                  // 转换表格
static convertLists(html)                   // 转换列表
static convertBlockquotes(html)              // 转换引用
static getConversionStats(html, markdown)  // 获取转换统计
```

## 🔧 主转换器 (DocxToMarkdownConverter)

**文件**: `converter.js`

**功能**:
- 使用mammoth库解析docx文件
- 协调各个转换模块
- 文件输入/输出处理
- 错误处理和验证

**增强功能**:
- 转换统计信息
- 文件验证
- 批量转换支持
- 详细的错误信息

## 📊 模块化优势

### 🎯 单一职责原则
每个模块只负责特定的功能：
- **ContentCleaner**: 专注于内容清理
- **ListProcessor**: 专注于列表处理
- **TableProcessor**: 专注于表格处理
- **HtmlToMarkdownConverter**: 专注于整体转换流程

### 🔧 易于维护
- 独立的功能模块，易于调试和修复
- 清晰的接口定义
- 减少代码耦合

### 📈 易于扩展
- 新的HTML元素类型可以独立添加
- 模块化的处理逻辑
- 统一的接口规范

### 🧪 易于测试
- 每个模块可以独立测试
- 清晰的输入输出
- 减少测试复杂度

## 🔄 数据流

```
docx文件 → mammoth → HTML → 各个处理模块 → Markdown → 文件输出
    ↓
1. docx文件读取
2. mammoth转换为HTML
3. HtmlToMarkdownConverter协调处理
4. 各个专门模块处理特定格式
5. 内容清理和验证
6. 输出Markdown文件
```

## 🧪 测试策略

### 单元测试
每个模块可以独立测试：

```javascript
// 测试内容清理器
const ContentCleaner = require('./libs/content-cleaner');
const cleanContent = ContentCleaner.decodeHtmlEntities('&amp; &lt; &gt;');

// 测试表格处理器
const TableProcessor = require('./libs/table-processor');
const tableMarkdown = TableProcessor.processTable(tableHtml);

// 测试列表处理器
const ListProcessor = require('./libs/list-processor');
const listMarkdown = ListProcessor.processUnorderedList(listHtml);
```

### 集成测试
通过主转换器进行完整测试：

```javascript
const DocxToMarkdownConverter = require('./converter');
const converter = new DocxToMarkdownConverter();
const result = await converter.convertFile('test.docx');
```

## 📝 开发指南

### 添加新的转换功能
1. 在相应的处理器模块中添加方法
2. 在HtmlToMarkdownConverter中调用
3. 添加单元测试
4. 更新文档

### 修改现有功能
1. 定位到具体的模块
2. 修改相关方法
3. 测试受影响的功能
4. 更新文档

## 🎯 性能优化

模块化带来的性能优势：
- **减少重复代码**: 公共功能提取到独立模块
- **提高执行效率**: 专门化的处理逻辑
- **降低内存占用**: 按需加载模块
- **便于缓存优化**: 模块级别的缓存策略

## 🔮 未来扩展

模块化架构为未来扩展奠定了基础：

### 可扩展的功能
- 自定义转换规则
- 插件系统
- 多格式输出支持
- 转换模板系统

### 可优化的方向
- 转换性能优化
- 内存使用优化
- 错误恢复机制
- 转换质量提升

现在的模块化架构使得项目更加专业、可维护和可扩展！🚀
