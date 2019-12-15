//自定义指令启动
Vue.directive('focus', {
	inserted: function(el) {
		el.focus();
	}
});

//过滤系统
Vue.filter('format', function(value, arg) {
	function dateFormat(date, format) {
		if (typeof date === 'string') {
			var mts = date.match(/(\/Date\((\d+)\)\/)/);
			if (mts && mts.length >= 3) {
				date = parseInt(mts[2]);
			}
		}
		date = new Date(date);
		if (!date || date.toUTCString() == 'Invalid Date') {
			return '';
		}
		var map = {
			M: date.getMonth() + 1, //月份
			d: date.getDate(), //日
			h: date.getHours(), //小时
			m: date.getMinutes(), //分
			s: date.getSeconds(), //秒
			q: Math.floor((date.getMonth() + 3) / 3), //季度
			S: date.getMilliseconds() //毫秒
		};
		format = format.replace(/([yMdhmsqS])+/g, function(all, t) {
			var v = map[t];
			if (v !== undefined) {
				if (all.length > 1) {
					v = '0' + v;
					v = v.substr(v.length - 2);
				}
				return v;
			} else if (t === 'y') {
				return (date.getFullYear() + '').substr(4 - all.length);
			}
			return all;
		});
		return format;
	}
	return dateFormat(value, arg);
});
//axios全局配置
axios.defaults.baseURL = 'http://localhost:3000';
new Vue({
	el: '.dk',
	data: {
		id: '',
		name: '',
		isdisabled: false,
		books: []
	},
	methods: {
		async add() {
			if (this.id != '' && this.name != '') {
				if (this.isdisabled) {
					let {data}=await axios.put("/books/"+this.id,{
						name:this.name
					})
					if (data.status == 200) {
						this.bookData()
					}
					this.isdisabled = false;
				} else {
					let obj = {
						//后台自己加id
						// id: this.id,
						name: this.name,
						date: new Date().getTime()
					};
					let {data} =await axios.post("/books",obj)
					if(data.status == 200){
						this.bookData()
					}
					
					this.books.push(obj);
				}
				this.id = this.name = '';
			} else {
				alert('书籍编号或书籍名称都不能为空');
			}
		},
		async del(id) {
			
			if (confirm("您真的要删除吗?")) {
				let {data} =await axios.delete("/books/"+id)
				
				if (data.status == 200) {
					this.bookData()
				}
			}
			
		},
		async upload(id, name) {
			let {data}=await axios.get('/books/'+id)
		
			if (data.status =200) {
				this.isdisabled = true;
				this.id = id;
				this.name = name;
			}
			
		},
		booksLength() {
			return this.books.length
		},

		bookData: async function() {
			let {
				data
			} = await axios.get('/books');
			this.books = data;
		}
	},
	created() {
		this.bookData();
	}
});
