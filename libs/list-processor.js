const ContentCleaner = require('./content-cleaner');
/**
 * 列表处理器 - 负责处理HTML列表转换
 */
class ListProcessor {
    /**
     * 处理无序列表
     * @param {string} htmlList - HTML无序列表内容
     * @returns {string} Markdown无序列表
     */
    static processUnorderedList(htmlList) {
        const items = htmlList.match(/<li[^>]*>(.*?)<\/li>/gi) || [];
        const listItems = items.map(item => {
            const content = item.replace(/<li[^>]*>(.*?)<\/li>/i, '$1');
            return `- ${ContentCleaner.cleanListItemContent(content)}`;
        });
        return listItems.join('\n') + '\n\n';
    }

    /**
     * 处理有序列表
     * @param {string} htmlList - HTML有序列表内容
     * @returns {string} Markdown有序列表
     */
    static processOrderedList(htmlList) {
        const items = htmlList.match(/<li[^>]*>(.*?)<\/li>/gi) || [];
        const listItems = items.map((item, index) => {
            const content = item.replace(/<li[^>]*>(.*?)<\/li>/i, '$1');
            return `${index + 1}. ${ContentCleaner.cleanListItemContent(content)}`;
        });
        return listItems.join('\n') + '\n\n';
    }

    /**
     * 提取列表项内容
     * @param {string} listItem - 列表项HTML
     * @returns {string} 提取的内容
     */
    static extractListItemContent(listItem) {
        return listItem.replace(/<li[^>]*>(.*?)<\/li>/i, '$1');
    }

    /**
     * 验证是否为有效的列表HTML
     * @param {string} content - HTML内容
     * @returns {boolean} 是否为有效列表
     */
    static isValidList(content) {
        return content.includes('<ul') || content.includes('<ol');
    }
}

module.exports = ListProcessor;
