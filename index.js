#!/usr/bin/env node
const DocxToMarkdownConverter = require('./converter');
const path = require('path');
const fs = require('fs');

class CommandLineInterface {
    constructor() {
        this.converter = new DocxToMarkdownConverter();
    }

    async run() {
        const args = process.argv.slice(2);

        // 如果没有参数，执行批量处理
        if (args.length === 0) {
            await this.batchProcess();
            return;
        }

        if (args.includes('--help') || args.includes('-h')) {
            this.showHelp();
            return;
        }

        if (args.includes('--version') || args.includes('-v')) {
            this.showVersion();
            return;
        }

        // 解析命令行参数
        const parsedArgs = this.parseArgs(args);

        if (!parsedArgs.input) {
            console.error('❌ 错误：请指定输入的docx文件路径');
            this.showUsage();
            return;
        }

        // 检查输入文件是否存在
        if (!fs.existsSync(parsedArgs.input)) {
            console.error(`❌ 错误：文件不存在：${parsedArgs.input}`);
            return;
        }

        // 检查文件扩展名
        if (!parsedArgs.input.toLowerCase().endsWith('.docx')) {
            console.error('❌ 错误：输入文件必须是.docx格式');
            return;
        }

        console.log('🔄 开始转换...');
        console.log(`📄 输入文件：${parsedArgs.input}`);
        if (parsedArgs.output) {
            console.log(`📄 输出文件：${parsedArgs.output}`);
        }

        // 执行转换
        const result = await this.converter.convertFile(parsedArgs.input, parsedArgs.output);

        if (result.success) {
            console.log('✅ 转换成功！');
            console.log(`📁 输出文件：${result.outputPath}`);
        } else {
            console.error('❌ 转换失败：');
            console.error(result.message);
            process.exit(1);
        }
    }

    async batchProcess() {
        console.log('🚀 批量转换模式启动...');

        const currentDir = process.cwd();
        const docDir = path.join(currentDir, 'doc');
        const outputDir = path.join(currentDir, 'output');

        // 检查doc目录是否存在
        if (!fs.existsSync(docDir)) {
            console.error('❌ 错误：doc目录不存在，请创建doc目录并放入要转换的docx文件');
            console.log(`📁 当前工作目录：${currentDir}`);
            console.log(`📁 期待的目录：${docDir}`);
            return;
        }

        // 创建output目录
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
            console.log(`📁 创建输出目录：${outputDir}`);
        }

        // 读取doc目录下的所有docx文件
        let files = [];
        try {
            files = fs.readdirSync(docDir)
                .filter(file => file.toLowerCase().endsWith('.docx'));
        } catch (error) {
            console.error(`❌ 读取doc目录失败：${error.message}`);
            return;
        }

        if (files.length === 0) {
            console.log('📭 doc目录中没有找到docx文件');
            return;
        }

        console.log(`📄 找到 ${files.length} 个docx文件：`);
        files.forEach((file, index) => {
            console.log(`   ${index + 1}. ${file}`);
        });
        console.log('');

        // 批量转换
        let successCount = 0;
        let failCount = 0;

        for (const file of files) {
            const inputPath = path.join(docDir, file);
            const outputFileName = path.basename(file, '.docx') + '.md';
            const outputPath = path.join(outputDir, outputFileName);

            console.log(`🔄 正在转换：${file}`);

            const result = await this.converter.convertFile(inputPath, outputPath);

            if (result.success) {
                console.log(`   ✅ 转换成功：${outputFileName}`);
                successCount++;
            } else {
                console.log(`   ❌ 转换失败：${result.message}`);
                failCount++;
            }
            console.log('');
        }

        // 显示统计信息
        console.log('📊 批量转换完成！');
        console.log(`✅ 成功：${successCount} 个文件`);
        console.log(`❌ 失败：${failCount} 个文件`);
        console.log(`📁 输出目录：${outputDir}`);

        if (successCount > 0) {
            console.log('');
            console.log('💡 转换后的文件已保存到output目录中');
        }
    }

    parseArgs(args) {
        const parsed = {
            input: null,
            output: null
        };

        for (let i = 0; i < args.length; i++) {
            const arg = args[i];

            if (arg === '-o' || arg === '--output') {
                if (i + 1 < args.length) {
                    parsed.output = args[i + 1];
                    i++; // 跳过下一个参数
                }
            } else if (!arg.startsWith('-')) {
                if (!parsed.input) {
                    parsed.input = arg;
                }
            }
        }

        return parsed;
    }

    showHelp() {
        console.log(`
📖 Docx转Markdown转换器

📋 描述：
  将docx文件转换为Markdown格式的工具

🚀 使用方法：
  node index.js <输入文件> [选项]
  node index.js                 # 批量转换模式

📝 参数：
  <输入文件>    要转换的docx文件路径

⚙️ 选项：
  -o, --output <输出文件>    指定输出的markdown文件路径（可选）
  -h, --help                 显示帮助信息
  -v, --version              显示版本信息

💡 示例：
  # 单文件转换
  node index.js document.docx
  node index.js document.docx -o output.md
  node index.js "/path/to/document.docx" --output "/path/to/output.md"
  
  # 批量转换（双击exe文件或直接运行不带参数）
  node index.js

📁 批量转换说明：
  - 自动读取当前目录下 "doc" 文件夹中的所有 .docx 文件
  - 转换后的文件保存到 "output" 文件夹中
  - 保持原文件名，仅更改扩展名为 .md

📁 单文件转换说明：
  - 如果不指定输出文件，将在输入文件同目录下生成同名.md文件
  - 支持转换标题、粗体、斜体、链接、图片、列表、引用等格式
  - 图片会被转换为base64格式的data URL

🔧 构建：
  npm run build          # 打包为可执行文件
  npm run build:win      # 打包为Windows exe文件
  npm run build:mac      # 打包为macOS可执行文件
  npm run build:linux    # 打包为Linux可执行文件
        `);
    }

    showUsage() {
        console.log(`
🚀 使用方法：
  node index.js <输入文件> [选项]
  
💡 查看完整帮助：
  node index.js --help
        `);
    }

    showVersion() {
        const packageJson = require('./package.json');
        console.log(`📦 版本：${packageJson.version}`);
    }
}

// 如果直接运行此文件，则启动命令行界面
if (require.main === module) {
    const cli = new CommandLineInterface();
    cli.run().catch(error => {
        console.error('❌ 发生未预期的错误：', error.message);
        process.exit(1);
    });
}

module.exports = CommandLineInterface;
