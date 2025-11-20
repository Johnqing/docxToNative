const ContentCleaner = require('./content-cleaner');
const ListProcessor = require('./list-processor');
const TableProcessor = require('./table-processor');
/**
 * HTML到Markdown转换器 - 负责将HTML转换为Markdown格式
 */
class HtmlToMarkdownConverter {
    /**
     * 将HTML转换为Markdown
     * @param {string} html - HTML内容
     * @returns {string} Markdown内容
     */
    static convert(html) {
        let markdown = html;

        // 转换标题
        markdown = this.convertHeadings(markdown);

        // 转换粗体和斜体
        markdown = this.convertTextFormatting(markdown);

        // 转换链接
        markdown = this.convertLinks(markdown);

        // 转换图片
        markdown = this.convertImages(markdown);

        // 转换代码块
        markdown = this.convertCodeBlocks(markdown);

        // 转换段落
        markdown = this.convertParagraphs(markdown);

        // 转换换行
        markdown = this.convertLineBreaks(markdown);

        // 转换表格
        markdown = this.convertTables(markdown);

        // 转换列表
        markdown = this.convertLists(markdown);

        // 转换引用
        markdown = this.convertBlockquotes(markdown);

        // 清理剩余的HTML标签
        markdown = ContentCleaner.removeHtmlTags(markdown);

        // 解码HTML实体
        markdown = ContentCleaner.decodeHtmlEntities(markdown);

        // 清理多余的空行
        markdown = ContentCleaner.cleanExtraLineBreaks(markdown);

        return markdown.trim();
    }

    /**
     * 转换标题
     * @param {string} html - HTML内容
     * @returns {string} 转换后的内容
     */
    static convertHeadings(html) {
        let markdown = html;

        markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
        markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
        markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
        markdown = markdown.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n');
        markdown = markdown.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n');
        markdown = markdown.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n');

        return markdown;
    }

    /**
     * 转换文本格式
     * @param {string} html - HTML内容
     * @returns {string} 转换后的内容
     */
    static convertTextFormatting(html) {
        let markdown = html;

        // 转换粗体和斜体
        markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
        markdown = markdown.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
        markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
        markdown = markdown.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');

        return markdown;
    }

    /**
     * 转换链接
     * @param {string} html - HTML内容
     * @returns {string} 转换后的内容
     */
    static convertLinks(html) {
        return html.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');
    }

    /**
     * 转换图片
     * @param {string} html - HTML内容
     * @returns {string} 转换后的内容
     */
    static convertImages(html) {
        let markdown = html;

        // 转换图片（带alt属性）
        markdown = markdown.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi, '![$2]($1)');

        // 转换图片（无alt属性）
        markdown = markdown.replace(/<img[^>]*src="([^"]*)"[^>]*>/gi, '![]($1)');

        return markdown;
    }

    /**
     * 转换代码块
     * @param {string} html - HTML内容
     * @returns {string} 转换后的内容
     */
    static convertCodeBlocks(html) {
        let markdown = html;

        // 转换代码块
        markdown = markdown.replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis, '```\n$1\n```\n\n');

        // 转换行内代码
        markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');

        return markdown;
    }

    /**
     * 转换段落
     * @param {string} html - HTML内容
     * @returns {string} 转换后的内容
     */
    static convertParagraphs(html) {
        return html.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
    }

    /**
     * 转换换行
     * @param {string} html - HTML内容
     * @returns {string} 转换后的内容
     */
    static convertLineBreaks(html) {
        return html.replace(/<br[^>]*>/gi, '\n');
    }

    /**
     * 转换表格
     * @param {string} html - HTML内容
     * @returns {string} 转换后的内容
     */
    static convertTables(html) {
        const self = this;
        return html.replace(/<table[^>]*>(.*?)<\/table>/gis, function (match) {
            const tableMarkdown = TableProcessor.processTable(match);
            return '\n' + tableMarkdown + '\n';
        });
    }

    /**
     * 转换列表
     * @param {string} html - HTML内容
     * @returns {string} 转换后的内容
     */
    static convertLists(html) {
        let markdown = html;

        // 转换无序列表
        markdown = markdown.replace(/<ul[^>]*>(.*?)<\/ul>/gis, function (match) {
            return ListProcessor.processUnorderedList(match);
        });

        // 转换有序列表
        markdown = markdown.replace(/<ol[^>]*>(.*?)<\/ol>/gis, function (match) {
            return ListProcessor.processOrderedList(match);
        });

        return markdown;
    }

    /**
     * 转换引用
     * @param {string} html - HTML内容
     * @returns {string} 转换后的内容
     */
    static convertBlockquotes(html) {
        return html.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, (match, content) => {
            const lines = content.trim().split('\n');
            return lines.map(line => `> ${line.trim()}`).join('\n') + '\n\n';
        });
    }

    /**
     * 验证HTML内容是否有效
     * @param {string} html - HTML内容
     * @returns {boolean} 是否有效
     */
    static isValidHtml(html) {
        return typeof html === 'string' && html.length > 0;
    }

    /**
     * 获取转换统计信息
     * @param {string} html - 原始HTML
     * @param {string} markdown - 转换后的Markdown
     * @returns {Object} 统计信息
     */
    static getConversionStats(html, markdown) {
        return {
            originalLength: html.length,
            convertedLength: markdown.length,
            compressionRatio: ((html.length - markdown.length) / html.length * 100).toFixed(2) + '%',
            tablesFound: (html.match(/<table/gi) || []).length,
            listsFound: (html.match(/<ul|<ol/gi) || []).length,
            imagesFound: (html.match(/<img/gi) || []).length,
            linksFound: (html.match(/<a/gi) || []).length,
            headingsFound: (html.match(/<h[1-6]/gi) || []).length
        };
    }
}

module.exports = HtmlToMarkdownConverter;
