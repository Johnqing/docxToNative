#!/usr/bin/env node
const DocxToMarkdownConverter = require('./converter');
const path = require('path');

async function testConverter() {
    console.log('🧪 开始测试转换器...');

    const converter = new DocxToMarkdownConverter();
    const testFile = 'doc/光伏电站现场处置方案lff1020.docx';

    console.log(`📄 测试文件：${testFile}`);

    try {
        // 执行转换
        const result = await converter.convertFile(testFile);

        if (result.success) {
            console.log('✅ 转换成功！');
            console.log(`📁 输出文件：${result.outputPath}`);

            // 检查输出文件是否存在
            const fs = require('fs');
            if (fs.existsSync(result.outputPath)) {
                const stats = fs.statSync(result.outputPath);
                console.log(`📊 文件大小：${(stats.size / 1024).toFixed(2)} KB`);
                console.log(`🕒 修改时间：${stats.mtime.toLocaleString()}`);
            }

        } else {
            console.error('❌ 转换失败：', result.message);
        }

    } catch (error) {
        console.error('❌ 测试失败：', error.message);
    }
}

// 如果直接运行此文件
if (require.main === module) {
    testConverter();
}

module.exports = testConverter;
