const mammoth = require('mammoth');
const fs = require('fs').promises;
const path = require('path');
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

    async convertFile(inputPath, outputPath = null) {
        try {
            // 读取docx文件
            const buffer = await fs.readFile(inputPath);

            // 转换为HTML
            const result = await mammoth.convertToHtml(buffer, this.options);

            // 将HTML转换为Markdown
            const markdown = this.htmlToMarkdown(result.value);

            // 确定输出路径
            if (!outputPath) {
                const inputDir = path.dirname(inputPath);
                const inputName = path.basename(inputPath, '.docx');
                outputPath = path.join(inputDir, `${inputName}.md`);
            }

            // 写入markdown文件
            await fs.writeFile(outputPath, markdown, 'utf8');

            return {
                success: true,
                outputPath,
                message: `转换成功！输出文件：${outputPath}`
            };

        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: `转换失败：${error.message}`
            };
        }
    }

    htmlToMarkdown(html) {
        let markdown = html;

        // 转换标题
        markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
        markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
        markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
        markdown = markdown.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n');
        markdown = markdown.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n');
        markdown = markdown.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n');

        // 转换粗体和斜体
        markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
        markdown = markdown.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
        markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
        markdown = markdown.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');

        // 转换链接
        markdown = markdown.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');

        // 转换图片
        markdown = markdown.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi, '![$2]($1)');
        markdown = markdown.replace(/<img[^>]*src="([^"]*)"[^>]*>/gi, '![]($1)');

        // 转换代码块
        markdown = markdown.replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis, '```\n$1\n```\n\n');
        markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');

        // 转换段落
        markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');

        // 转换换行
        markdown = markdown.replace(/<br[^>]*>/gi, '\n');

        // 转换表格
        const self = this;
        markdown = markdown.replace(/<table[^>]*>(.*?)<\/table>/gis, function (match) {
            const tableMarkdown = self.processTable(match);
            return '\n' + tableMarkdown + '\n';
        });

        // 转换列表
        markdown = markdown.replace(/<ul[^>]*>(.*?)<\/ul>/gis, function (match) { return self.processUnorderedList(match); });
        markdown = markdown.replace(/<ol[^>]*>(.*?)<\/ol>/gis, function (match) { return self.processOrderedList(match); });

        // 转换引用
        markdown = markdown.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, (match, content) => {
            const lines = content.trim().split('\n');
            return lines.map(line => `> ${line.trim()}`).join('\n') + '\n\n';
        });

        // 清理剩余的HTML标签
        markdown = markdown.replace(/<[^>]*>/g, '');

        // 解码HTML实体
        markdown = markdown.replace(/&nbsp;/g, ' ');
        markdown = markdown.replace(/&amp;/g, '&');
        markdown = markdown.replace(/&lt;/g, '<');
        markdown = markdown.replace(/&gt;/g, '>');
        markdown = markdown.replace(/&quot;/g, '"');
        markdown = markdown.replace(/&#39;/g, "'");

        // 清理多余的空行
        markdown = markdown.replace(/\n{3,}/g, '\n\n');

        return markdown.trim();
    }

    processUnorderedList(match) {
        const items = match.match(/<li[^>]*>(.*?)<\/li>/gi) || [];
        const listItems = items.map(item => {
            const content = item.replace(/<li[^>]*>(.*?)<\/li>/i, '$1');
            return `- ${this.cleanListItemContent(content)}`;
        });
        return listItems.join('\n') + '\n\n';
    }

    processOrderedList(match) {
        const items = match.match(/<li[^>]*>(.*?)<\/li>/gi) || [];
        const listItems = items.map((item, index) => {
            const content = item.replace(/<li[^>]*>(.*?)<\/li>/i, '$1');
            return `${index + 1}. ${this.cleanListItemContent(content)}`;
        });
        return listItems.join('\n') + '\n\n';
    }

    cleanListItemContent(content) {
        // 移除段落标签并清理内容
        return content.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1')
            .replace(/<[^>]*>/g, '')
            .trim();
    }

    processTable(htmlTable) {
        try {
            // 提取表头
            const theadMatch = htmlTable.match(/<thead[^>]*>(.*?)<\/thead>/gis);
            const tbodyMatch = htmlTable.match(/<tbody[^>]*>(.*?)<\/tbody>/gis);

            let rows = [];

            // 处理表头
            if (theadMatch) {
                const thead = theadMatch[0];
                const headerRows = this.extractTableRows(thead);
                rows = rows.concat(headerRows);
            }

            // 处理表体
            if (tbodyMatch) {
                const tbody = tbodyMatch[0];
                const bodyRows = this.extractTableRows(tbody);
                rows = rows.concat(bodyRows);
            } else {
                // 如果没有thead和tbody，直接提取所有tr
                rows = this.extractTableRows(htmlTable);
            }

            if (rows.length === 0) {
                return '';
            }

            // 转换为Markdown表格
            let markdownTable = '';

            // 添加第一行（通常是表头）
            if (rows.length > 0) {
                markdownTable += '| ' + rows[0].join(' | ') + ' |\n';

                // 添加分隔线
                const separators = rows[0].map(() => '---');
                markdownTable += '| ' + separators.join(' | ') + ' |\n';

                // 添加数据行
                for (let i = 1; i < rows.length; i++) {
                    markdownTable += '| ' + rows[i].join(' | ') + ' |\n';
                }
            }

            return markdownTable + '\n';

        } catch (error) {
            console.warn('表格转换失败:', error.message);
            return '';
        }
    }

    extractTableRows(tableHtml) {
        const rows = [];
        const trMatches = tableHtml.match(/<tr[^>]*>(.*?)<\/tr>/gis);

        if (!trMatches) {
            return rows;
        }

        for (const tr of trMatches) {
            const cells = [];

            // 提取表头单元格 (th)
            const thMatches = tr.match(/<th[^>]*>(.*?)<\/th>/gis);
            if (thMatches) {
                for (const th of thMatches) {
                    const content = this.cleanTableCellContent(th);
                    cells.push(content);
                }
            }

            // 如果没有表头，提取数据单元格 (td)
            if (cells.length === 0) {
                const tdMatches = tr.match(/<td[^>]*>(.*?)<\/td>/gis);
                if (tdMatches) {
                    for (const td of tdMatches) {
                        const content = this.cleanTableCellContent(td);
                        cells.push(content);
                    }
                }
            }

            if (cells.length > 0) {
                rows.push(cells);
            }
        }

        return rows;
    }

    cleanTableCellContent(cellHtml) {
        // 移除单元格标签并清理内容
        let content = cellHtml;

        // 移除单元格标签
        content = content.replace(/<(th|td)[^>]*>/gi, '').replace(/<\/(th|td)>/gi, '');

        // 移除段落标签
        content = content.replace(/<p[^>]*>/gi, '').replace(/<\/p>/gi, ' ');

        // 移除其他HTML标签
        content = content.replace(/<[^>]*>/g, '');

        // 解码HTML实体
        content = content.replace(/&nbsp;/g, ' ');
        content = content.replace(/&amp;/g, '&');
        content = content.replace(/&lt;/g, '<');
        content = content.replace(/&gt;/g, '>');
        content = content.replace(/&quot;/g, '"');
        content = content.replace(/&#39;/g, "'");

        // 清理空白字符并转义管道符（Markdown表格分隔符）
        content = content.trim().replace(/\s+/g, ' ').replace(/\|/g, '\\|');

        return content;
    }
}

module.exports = DocxToMarkdownConverter;
