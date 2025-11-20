const ContentCleaner = require('./content-cleaner');
/**
 * 表格处理器 - 负责处理HTML表格转换
 */
class TableProcessor {
    /**
     * 处理HTML表格
     * @param {string} htmlTable - HTML表格内容
     * @returns {string} Markdown表格
     */
    static processTable(htmlTable) {
        try {
            // 提取表头和表体
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

            return this.convertToMarkdownTable(rows);

        } catch (error) {
            console.warn('表格转换失败:', error.message);
            return '';
        }
    }

    /**
     * 提取表格行
     * @param {string} tableHtml - 表格HTML内容
     * @returns {Array} 表格行数组
     */
    static extractTableRows(tableHtml) {
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
                    const content = ContentCleaner.cleanTableCellContent(th);
                    cells.push(content);
                }
            }

            // 如果没有表头，提取数据单元格 (td)
            if (cells.length === 0) {
                const tdMatches = tr.match(/<td[^>]*>(.*?)<\/td>/gis);
                if (tdMatches) {
                    for (const td of tdMatches) {
                        const content = ContentCleaner.cleanTableCellContent(td);
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

    /**
     * 将表格行数组转换为Markdown表格
     * @param {Array} rows - 表格行数组
     * @returns {string} Markdown表格
     */
    static convertToMarkdownTable(rows) {
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
    }

    /**
     * 验证是否为有效的表格HTML
     * @param {string} content - HTML内容
     * @returns {boolean} 是否为有效表格
     */
    static isValidTable(content) {
        return content.includes('<table') && content.includes('</table>');
    }

    /**
     * 获取表格的列数
     * @param {string} tableHtml - 表格HTML
     * @returns {number} 列数
     */
    static getColumnCount(tableHtml) {
        const firstRow = tableHtml.match(/<tr[^>]*>(.*?)<\/tr>/i);
        if (!firstRow) return 0;

        const thCount = (firstRow[1].match(/<th/gi) || []).length;
        const tdCount = (firstRow[1].match(/<td/gi) || []).length;

        return Math.max(thCount, tdCount);
    }

    /**
     * 检查表格是否有表头
     * @param {string} tableHtml - 表格HTML
     * @returns {boolean} 是否有表头
     */
    static hasHeader(tableHtml) {
        return tableHtml.includes('<th') || tableHtml.includes('<thead>');
    }
}

module.exports = TableProcessor;
