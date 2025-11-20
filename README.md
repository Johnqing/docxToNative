# Docx转Markdown转换器
一个基于Node.js的工具，用于将docx文件转换为Markdown格式，并可以打包为独立的可执行文件。

## 功能特性

- ✅ 支持将docx文件转换为Markdown格式
- ✅ 保持原始文档的格式结构
- ✅ 支持标题、段落、粗体、斜体等基本格式
- ✅ 支持链接和图片转换
- ✅ 支持有序和无序列表
- ✅ 支持引用块
- ✅ 支持代码块
- ✅ 可打包为独立的exe文件（Windows、macOS、Linux）

## 安装依赖

```bash
npm install
```

## 使用方法

### 方式1: 使用可执行文件（推荐）

#### Windows用户
```bash
# 单文件转换
dist\index.exe document.docx

# 指定输出文件
dist\index.exe document.docx -o output.md

# 批量转换（双击运行）
dist\index.exe

# 查看帮助
dist\index.exe --help

# 查看版本
dist\index.exe --version
```

#### macOS/Linux用户
```bash
# 单文件转换
./dist/index document.docx

# 指定输出文件
./dist/index document.docx -o output.md

# 批量转换
./dist/index

# 查看帮助
./dist/index --help

# 查看版本
./dist/index --version
```

### 方式2: Node.js运行

```bash
# 基本用法
node index.js document.docx

# 指定输出文件
node index.js document.docx -o output.md

# 查看帮助
node index.js --help

# 查看版本
node index.js --version
```

### 参数说明

- `<输入文件>`: 要转换的docx文件路径
- `-o, --output`: 指定输出的markdown文件路径（可选）
- `-h, --help`: 显示帮助信息
- `-v, --version`: 显示版本信息

## 构建可执行文件

### 构建所有平台
```bash
npm run build:all
```

### 构建特定平台
```bash
# Windows
npm run build:win

# macOS
npm run build:mac

# Linux
npm run build:linux
```

构建完成后，可执行文件将在 `dist` 目录中生成：
- Windows: `index.exe`
- macOS: `index`
- Linux: `index`

## 项目结构

```
├── index.js          # 主程序入口（命令行界面）
├── converter.js      # 核心转换功能
├── package.json      # 项目配置和依赖
├── README.md         # 项目文档
├── .gitignore       # Git忽略文件
├── test.js          # 测试脚本
└── dist/             # 构建输出目录
    ├── index.exe      # Windows可执行文件
    └── index         # macOS/Linux可执行文件
```

## 转换格式支持

| 原始格式 | Markdown格式 | 说明 |
|---------|-------------|------|
| 标题1-6 | # - ###### | 自动识别标题级别 |
| 粗体 | **文本** | 支持strong和b标签 |
| 斜体 | *文本* | 支持em和i标签 |
| 链接 | [文本](URL) | 自动提取链接地址 |
| 图片 | ![alt](URL) | 图片转为base64 |
| 表格 | | Header | | 支持复杂表格结构 |
| 有序列表 | 1. 2. 3. | 保持编号顺序 |
| 无序列表 | - - - | 使用破折号 |
| 引用 | > 文本 | 多行引用支持 |
| 代码 | `代码` | 行内代码 |
| 代码块 | ```代码``` | 多行代码块 |

## dist目录文件使用指南

### 📁 可执行文件说明
`dist` 目录包含了预编译的可执行文件，无需Node.js环境即可运行：

- **Windows**: `index.exe` - Windows平台的可执行文件
- **macOS/Linux**: `index` - Unix系统的可执行文件

### 🚀 快速开始

#### 1. 单文件转换
**Windows:**
```bash
# 基本转换
dist\index.exe document.docx

# 指定输出路径
dist\index.exe document.docx -o output.md
```

**macOS/Linux:**
```bash
# 基本转换
./dist/index document.docx

# 指定输出路径
./dist/index document.docx -o output.md
```

#### 2. 批量转换（推荐）
只需双击可执行文件即可批量处理：

**Windows:**
- 双击 `dist\index.exe`
- 或命令行运行：`dist\index.exe`

**macOS/Linux:**
- 双击 `dist/index`
- 或命令行运行：`./dist/index`

#### 3. 查看帮助和版本
```bash
# 查看帮助
dist\index.exe --help          # Windows
./dist/index --help            # macOS/Linux

# 查看版本
dist\index.exe --version       # Windows
./dist/index --version         # macOS/Linux
```

### ⚠️ 使用注意事项
- **权限问题**：确保可执行文件有执行权限（Linux/macOS）
- **路径问题**：使用相对路径或绝对路径，避免路径包含空格
- **中文支持**：完美支持中文文件名和路径
- **独立运行**：无需安装Node.js环境

## 使用示例

### 单文件转换示例
假设有一个 `example.docx` 文件：

```bash
# 使用可执行文件
dist\index.exe example.docx

# 输出：
# 🔄 开始转换...
# 📄 输入文件：example.docx
# ✅ 转换成功！
# 📁 输出文件：example.md
```

### 批量转换示例
使用批量转换时，需要以下目录结构，将多个docx文件放入doc目录后，
双击 `docxToMarkdown.exe`
```
项目目录/
├── doc/              # 放入要转换的docx文件
│   ├── file1.docx
│   └── file2.docx
├── output/           # 转换后的markdown文件（自动创建）
│   ├── file1.md
│   └── file2.md
└── docxToMarkdown.exe
```

## 错误处理

- 文件不存在：会显示友好的错误信息
- 文件格式错误：只支持.docx格式
- 转换失败：会显示具体的错误原因
- 权限问题：确保可执行文件有执行权限（Linux/macOS）
- 路径问题：避免使用包含空格的路径，或使用引号包裹

## 技术实现

- **mammoth**: 用于解析docx文件
- **pkg**: 用于打包为可执行文件
- **自定义HTML到Markdown转换器**: 处理格式转换

## 更新日志

### v1.0.1 (2025-11-19)
- ✅ 修复了列表处理中的`this`绑定问题
- ✅ 改进了错误处理机制
- ✅ 增强了对中文文档的支持
- ✅ 添加了测试脚本验证转换功能

## 许可证

ISC License

## 贡献

欢迎提交Issue和Pull Request！
