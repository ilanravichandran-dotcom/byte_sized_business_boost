/**
 * Report Generator Module
 * Handles report generation, filtering, and export functionality
 */

const ReportGenerator = (() => {
    /**
     * Get filtered businesses based on report settings
     */
    function getFilters(businesses) {
        const category = document.getElementById('reportCategory').value;
        const ratingMin = parseFloat(document.getElementById('reportRatingMin').value) || 0;
        const onlyFavorites = document.getElementById('reportOnlyFavorites').checked;

        let filtered = businesses;

        if (category) {
            filtered = filtered.filter(b => b.category === category);
        }

        filtered = filtered.filter(b => {
            const rating = BusinessService.calculateRating(b.reviews);
            return rating >= ratingMin;
        });

        if (onlyFavorites) {
            const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
            filtered = filtered.filter(b => favorites.includes(b.id));
        }

        return filtered;
    }

    /**
     * Get selected field names from checkboxes
     */
    function getSelectedFields() {
        const checkboxes = document.querySelectorAll('.field-checkbox:checked');
        return Array.from(checkboxes).map(cb => cb.value);
    }

    /**
     * Format business data for report
     */
    function formatBusinessForReport(business, fields) {
        const data = {};
        const rating = BusinessService.calculateRating(business.reviews);
        const reviewCount = business.reviews ? business.reviews.length : 0;

        fields.forEach(field => {
            switch (field) {
                case 'name':
                    data.name = business.name;
                    break;
                case 'category':
                    data.category = business.category.charAt(0).toUpperCase() + business.category.slice(1);
                    break;
                case 'address':
                    data.address = business.address;
                    break;
                case 'phone':
                    data.phone = business.phone || 'N/A';
                    break;
                case 'rating':
                    data.rating = rating.toFixed(1);
                    break;
                case 'reviewCount':
                    data['Review Count'] = reviewCount;
                    break;
                case 'description':
                    data.description = business.description;
                    break;
                case 'deal':
                    data['Current Deal'] = business.deal ? business.deal.title : 'None';
                    break;
            }
        });

        return data;
    }

    /**
     * Generate CSV content
     */
    function generateCSVContent(businesses) {
        const filtered = getFilters(businesses);
        const fields = getSelectedFields();

        if (filtered.length === 0) {
            alert('No businesses match your filter criteria.');
            return null;
        }

        if (fields.length === 0) {
            alert('Please select at least one field to include in the report.');
            return null;
        }

        const formatted = filtered.map(b => formatBusinessForReport(b, fields));
        const headers = Object.keys(formatted[0]);

        let csv = headers.map(h => `"${h}"`).join(',') + '\n';
        csv += formatted.map(row => {
            return headers.map(header => {
                const value = row[header] || '';
                const escaped = String(value).replace(/"/g, '""');
                return `"${escaped}"`;
            }).join(',');
        }).join('\n');

        return csv;
    }

    /**
     * Download CSV file
     */
    function downloadCSV(businesses) {
        const csv = generateCSVContent(businesses);

        if (!csv) return;

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `LocalLens_Report_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    /**
     * Generate HTML preview
     */
    function generateReportHTML(businesses) {
        const filtered = getFilters(businesses);
        const fields = getSelectedFields();

        if (filtered.length === 0) {
            return '<p class="empty-message">No businesses match your filter criteria.</p>';
        }

        if (fields.length === 0) {
            return '<p class="empty-message">Please select at least one field to include in the report.</p>';
        }

        const formatted = filtered.map(b => formatBusinessForReport(b, fields));
        const headers = Object.keys(formatted[0]);

        let html = '<table style="width: 100%; border-collapse: collapse; margin-top: 1rem;">';
        html += '<thead style="background-color: var(--primary-color); color: white;"><tr>';
        headers.forEach(header => {
            html += `<th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">${BusinessService.escapeHtml(header)}</th>`;
        });
        html += '</tr></thead>';

        html += '<tbody>';
        formatted.forEach((row, index) => {
            const bgColor = index % 2 === 0 ? '#f9f9f9' : 'white';
            html += `<tr style="background-color: ${bgColor};">`;
            headers.forEach(header => {
                const value = row[header] || '';
                html += `<td style="padding: 0.75rem; border: 1px solid #ddd;">${BusinessService.escapeHtml(String(value))}</td>`;
            });
            html += '</tr>';
        });
        html += '</tbody></table>';

        html += `<div style="margin-top: 2rem; padding: 1rem; background-color: var(--light-gray); border-radius: 4px;">`;
        html += `<p><strong>Total Businesses:</strong> ${filtered.length}</p>`;

        if (fields.includes('rating')) {
            const avgRating = filtered.reduce((sum, b) => sum + BusinessService.calculateRating(b.reviews), 0) / filtered.length;
            html += `<p><strong>Average Rating:</strong> ${avgRating.toFixed(1)}</p>`;
        }

        const totalReviews = filtered.reduce((sum, b) => sum + (b.reviews ? b.reviews.length : 0), 0);
        html += `<p><strong>Total Reviews:</strong> ${totalReviews}</p>`;
        html += `<p><strong>Generated:</strong> ${new Date().toLocaleString()}</p></div>`;

        return html;
    }

    /**
     * Show report preview
     */
    function preview(businesses) {
        const preview = document.getElementById('reportPreview');
        const content = document.getElementById('reportContent');

        content.innerHTML = generateReportHTML(businesses);
        preview.style.display = 'block';
        preview.scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Print report
     */
    function print(businesses) {
        const html = generateReportHTML(businesses);
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>LocalLens Report</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    h1 { color: var(--primary-color); }
                    table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
                    th { background-color: var(--primary-color); color: white; padding: 0.75rem; text-align: left; border: 1px solid #ddd; }
                    td { padding: 0.75rem; border: 1px solid #ddd; }
                    tr:nth-child(even) { background-color: #f9f9f9; }
                    .summary { margin-top: 2rem; padding: 1rem; background-color: #f0f0f0; border-radius: 4px; }
                    @media print { body { margin: 0; } }
                </style>
            </head>
            <body>
                <h1>LocalLens Business Report</h1>
                <p><em>Generated: ${new Date().toLocaleString()}</em></p>
                ${html}
            </body>
            </html>
        `);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 250);
    }

    return {
        getFilters,
        getSelectedFields,
        formatBusinessForReport,
        downloadCSV,
        preview,
        print
    };
})();
