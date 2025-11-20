const mammoth = require('mammoth');
const fs = require('fs').promises;
const path = require('path');
const HtmlToMarkdownConverter = require('./libs/html-to-markdown');

/**
 * Docx到Markdown转换器主类
 * 负责协调各个转换模块，完成docx到Markdown的完整转换流程
 */
class DocxToMarkdownConverter {
    constructor() {
        this.options = {
            styleMap: [
                "p[heading-style-name='Heading 1'] => h1:fresh",
                "p[heading-style-name='Heading 2'] => h2:fresh",
                "p[heading-style-name='Heading 3'] => h3:fresh",
                "p[heading-style-name='Heading 4'] => h4:fresh",
                "p[heading-style-name='Heading 5'] => h5:fresh",
                "p[heading-style-name='Heading 6'] => h6:fresh",
                "p[style-name='Heading 1'] => h1:fresh",
                "p[style-name='Heading 2'] => h2:fresh",
                "p[style-name='Heading 3'] => h3:fresh",
                "p[style-name='Heading 4'] => h4:fresh",
                "p[style-name='Heading 5'] => h5:fresh",
                "p[style-name='Heading 6'] => h6:fresh"
            ],
            convertImage: mammoth.images.imgElement(function (image) {
                return image.read("base64").then(function (imageBuffer) {
                    return {
                        src: "data:" + image.contentType + ";base64," + imageBuffer
                    };
                });
            })
        };
    }

    /**
     * 转换docx文件到Markdown
     * @param {string} inputPath - 输入文件路径
     * @param {string} outputPath - 输出文件路径（可选）
     * @returns {Promise<Object>} 转换结果
     */
    async convertFile(inputPath, outputPath = null) {
        try {
            // 读取docx文件
            const buffer = await fs.readFile(inputPath);

            // 转换为HTML
            const result = await mammoth.convertToHtml(buffer, this.options);

            // 验证转换结果
            if (!result.value) {
                throw new Error('无法从docx文件提取内容');
            }

            // 将HTML转换为Markdown
            const markdown = HtmlToMarkdownConverter.convert(result.value);

            // 确定输出路径
            if (!outputPath) {
                const inputDir = path.dirname(inputPath);
                const inputName = path.basename(inputPath, '.docx');
                outputPath = path.join(inputDir, `${inputName}.md`);
            }

            // 写入markdown文件
            await fs.writeFile(outputPath, markdown, 'utf8');

            // 获取转换统计信息
            const stats = HtmlToMarkdownConverter.getConversionStats(result.value, markdown);

            return {
                success: true,
                outputPath,
                message: `转换成功！输出文件：${outputPath}`,
                stats: stats
            };

        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: `转换失败：${error.message}`
            };
        }
    }

    /**
     * 批量转换docx文件
     * @param {string} inputDir - 输入目录
     * @param {string} outputDir - 输出目录
     * @returns {Promise<Object>} 批量转换结果
     */
    async convertFiles(inputDir, outputDir) {
        try {
            const files = await fs.readdir(inputDir);
            const docxFiles = files.filter(file => file.toLowerCase().endsWith('.docx'));

            if (docxFiles.length === 0) {
                return {
                    success: true,
                    totalFiles: 0,
                    convertedFiles: 0,
                    failedFiles: 0,
                    message: '没有找到docx文件'
                };
            }

            let convertedCount = 0;
            let failedCount = 0;
            const results = [];

            for (const file of docxFiles) {
                const inputPath = path.join(inputDir, file);
                const outputFileName = path.basename(file, '.docx') + '.md';
                const outputPath = path.join(outputDir, outputFileName);

                const result = await this.convertFile(inputPath, outputPath);
                results.push({
                    inputFile: file,
                    outputFile: outputFileName,
                    success: result.success,
                    message: result.message,
                    stats: result.stats
                });

                if (result.success) {
                    convertedCount++;
                } else {
                    failedCount++;
                }
            }

            return {
                success: true,
                totalFiles: docxFiles.length,
                convertedFiles: convertedCount,
                failedFiles: failedCount,
                results: results,
                message: `批量转换完成：成功 ${convertedCount} 个，失败 ${failedCount} 个`
            };

        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: `批量转换失败：${error.message}`
            };
        }
    }

    /**
     * 验证输入文件
     * @param {string} filePath - 文件路径
     * @returns {Object} 验证结果
     */
    validateInputFile(filePath) {
        const result = {
            isValid: true,
            errors: []
        };

        // 检查文件是否存在
        if (!fs.existsSync(filePath)) {
            result.isValid = false;
            result.errors.push('文件不存在');
            return result;
        }

        // 检查文件扩展名
        if (!filePath.toLowerCase().endsWith('.docx')) {
            result.isValid = false;
            result.errors.push('文件必须是.docx格式');
        }

        // 检查文件是否可读
        try {
            fs.accessSync(filePath, fs.constants.R_OK);
        } catch (error) {
            result.isValid = false;
            result.errors.push('文件无法读取');
        }

        return result;
    }

    /**
     * 获取转换器配置信息
     * @returns {Object} 配置信息
     */
    getConfig() {
        return {
            version: require('./package.json').version,
            supportedFormats: ['.docx'],
            outputFormat: 'markdown',
            features: {
                headings: true,
                textFormatting: true,
                links: true,
                images: true,
                tables: true,
                lists: true,
                blockquotes: true,
                codeBlocks: true
            }
        };
    }
}

module.exports = DocxToMarkdownConverter;
