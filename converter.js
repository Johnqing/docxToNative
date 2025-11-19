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

        // 转换列表
        const self = this;
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
}

module.exports = DocxToMarkdownConverter;
