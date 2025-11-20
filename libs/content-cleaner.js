/**
 * 内容清理器 - 负责清理HTML标签和解码实体
 */
class ContentCleaner {
    /**
     * 清理列表项内容
     * @param {string} content - 原始内容
     * @returns {string} 清理后的内容
     */
    static cleanListItemContent(content) {
        return content.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1')
            .replace(/<[^>]*>/g, '')
            .trim();
    }
    /**
     * 清理表格单元格内容
     * @param {string} cellHtml - 单元格HTML内容
     * @returns {string} 清理后的内容
     */
    static cleanTableCellContent(cellHtml) {
        let content = cellHtml;

        // 移除单元格标签
        content = content.replace(/<(th|td)[^>]*>/gi, '').replace(/<\/(th|td)>/gi, '');

        // 移除段落标签
        content = content.replace(/<p[^>]*>/gi, '').replace(/<\/p>/gi, ' ');

        // 移除其他HTML标签
        content = content.replace(/<[^>]*>/g, '');

        // 解码HTML实体
        content = this.decodeHtmlEntities(content);

        // 清理空白字符并转义管道符（Markdown表格分隔符）
        content = content.trim().replace(/\s+/g, ' ').replace(/\|/g, '\\|');

        return content;
    }

    /**
     * 解码HTML实体
     * @param {string} content - 包含HTML实体的内容
     * @returns {string} 解码后的内容
     */
    static decodeHtmlEntities(content) {
        return content.replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'");
    }

    /**
     * 清理剩余的HTML标签
     * @param {string} content - 原始内容
     * @returns {string} 清理后的内容
     */
    static removeHtmlTags(content) {
        return content.replace(/<[^>]*>/g, '');
    }

    /**
     * 清理多余的空行
     * @param {string} content - 原始内容
     * @returns {string} 清理后的内容
     */
    static cleanExtraLineBreaks(content) {
        return content.replace(/\n{3,}/g, '\n\n');
    }
}

module.exports = ContentCleaner;
