# 快速开始指南
## 🚀 项目已完成！

您的docx转markdown转换器已经成功创建并可以使用了。

## 📁 项目结构

```
koudaibDemo/
├── index.js              # 主程序文件
├── converter.js           # 核心转换功能
├── package.json          # 项目配置
├── README.md             # 详细文档
├── USAGE.md              # 使用指南
├── .gitignore           # Git忽略配置
├── test.js              # 测试脚本
└── dist/                 # 构建输出
    ├── index            # macOS/Linux可执行文件
    └── index.exe        # Windows可执行文件
```

## 🎯 使用方法

### 方法1: Node.js运行
```bash
# 查看帮助
node index.js --help

# 转换单个文件
node index.js your-document.docx

# 批量转换（推荐）
node index.js
```

### 方法2: 使用可执行文件（推荐）
```bash
# Windows - 双击运行或命令行
./dist/index.exe

# macOS/Linux - 双击运行或命令行  
./dist/index
```

## 📝 支持的转换格式

✅ **标题**: H1-H6 → # - ######  
✅ **粗体**: **文本**  
✅ **斜体**: *文本*  
✅ **链接**: [文本](URL)  
✅ **图片**: ![alt](URL) (转换为base64)  
✅ **有序列表**: 1. 2. 3.  
✅ **无序列表**: - - -  
✅ **引用**: > 文本  
✅ **代码**: `代码` 和 ```代码块```  

## 🔧 批量转换步骤

1. **准备文件**：将要转换的docx文件放入 `doc` 文件夹
2. **双击运行**：双击 `index.exe`（Windows）或 `index`（macOS/Linux）
3. **查看结果**：转换后的文件在 `output` 文件夹中

## 📦 分发

`dist` 目录中的可执行文件可以直接分发给其他用户使用，无需安装Node.js环境。

## 🐛 常见问题

**Q: 转换后格式丢失？**
A: 复杂的docx格式可能需要调整转换规则，检查原始文档的样式设置。

**Q: 图片无法显示？**
A: 图片被转换为base64，确保原始docx文件中的图片是嵌入式的。

**Q: 特殊字符异常？**
A: 检查字符编码，确保使用UTF-8。

**Q: 批量转换没有找到文件？**
A: 确保docx文件放在 `doc` 目录中，而不是其他目录。

## 🎉 恭喜！

您现在拥有一个功能完整的docx转markdown转换器，可以：
- 在任何支持的平台上运行
- 处理各种文档格式
- 打包为独立可执行文件
- 无需依赖即可分发使用
- 支持批量处理多个文件

开始使用吧！🚀
