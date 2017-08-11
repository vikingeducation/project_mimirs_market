const Handlebars = require('handlebars');
module.exports = {
	breadcrumbs: function(crumbs) {
		let html = `<ol class="breadcrumb">`;
		html = html.concat(`<li>Home</li>`);
		crumbs.forEach((item, idx) => {
			if (idx !== crumbs.length - 1) {
				html = html.concat(`<li><a href="${item.href}">${item.name}</a></li>`);
			} else {
				html = html.concat(`<li>${item.name}</li>`);
			}
		});
		html = html.concat(`</ol>`);
		return new Handlebars.SafeString(html);
	},
	rating: function(num) {
		let html = '';
		for (let i = 0; i < 5; i++) {
			html = html.concat(`<span class="glyphicon glyphicon-star`);
			if (i >= num) {
				html = html.concat('-empty');
			}
			html = html.concat(`" aria-hidden="true"></span>`);
		}
		return new Handlebars.SafeString(html);
	},
	paginate: function(data) {
		data.currentPage = +data.currentPage;
		data.pageCount = +data.pageCount;

		let html = '<nav class="text-center" aria-label="Page navigation">';
		html += '<ul id="pagination-container" class="pagination">';

		if (data.currentPage !== 0) {
			html += '<li>';
			html +=
				`<a href="/api/products/paginate/${data.currentPage -
					1}" aria-label="Previous">` +
				'<span aria-hidden="true">&laquo;</span>' +
				'</a>';
			html += '</li>';
		} else {
			html += '<li class="disabled">';
			html += '<span aria-hidden="true">&laquo;</span>';
			html += '</li>';
		}

		for (let i = 0; i < data.pageCount; i++) {
			if (+data.currentPage === i) {
				html += `<li class="active"><span>${i + 1}</span></li>`;
			} else {
				html += `<li><a href="/api/products/paginate/${i}">${i + 1}</a></li>`;
			}
		}

		if (data.currentPage !== data.pageCount - 1) {
			html += '<li>';
			html +=
				`<a href="/api/products/paginate/${data.currentPage +
					1}" aria-label="Next">` +
				'<span aria-hidden="true">&raquo;</span>' +
				'</a>';
			html += '</li>';
		} else {
			html += '<li class="disabled">';
			html += '<span aria-hidden="true">&raquo;</span>';
			html += '</li>';
		}

		html += '</ul>';
		html += '</nav>';

		return new Handlebars.SafeString(html);
	}
};
