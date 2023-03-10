import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

const site = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'luckymia';

let productModal = {};
let delProductModal = {};

const app ={
    data(){
        return{
            products:[],
            tempProduct:{
              imagesUrl: [],
            },
            isNew: false,
        }
    },
    methods: {
        checkLogin(){
            const checkUrl = `${site}/api/user/check`;
            axios.post(checkUrl) //驗證
              .then((res)=>{
                this.getProducts();
              }) 
              .catch((err)=>{
                alert(err.data.message);
                window.location = 'login.html';
              })
        },
        getProducts(){
            const getProductsUrl = `${site}/api/${apiPath}/admin/products/all`;
            axios.get(getProductsUrl)  //取得產品
              .then((res)=>{
                this.products = res.data.products;
              })
              .catch((err)=>{
                alert(err.data.message);
              })
        },
        updateProduct(){
          let url = `${site}/api/${apiPath}/admin/product`;
          //用this.isNew判斷api要如何運行
          let method = 'post';
          if (!this.isNew){
            url = `${site}/api/${apiPath}/admin/product/${this.tempProduct.id}`;
            method = 'put';
          }
          axios[method](url, {data:this.tempProduct}) //新增產品或編輯產品
            .then(()=>{
              this.getProducts();
              productModal.hide(); //關閉modal
            })
            .catch((err)=>{
              alert(err.data.message);
            })
        },
        deleteProduct(){
          const url = `${site}/api/${apiPath}/admin/product/${this.tempProduct.id}`;
          axios.delete(url) //新增產品或編輯產品
            .then((res)=>{
              this.getProducts();
              delProductModal.hide(); //關閉modal
            })
            .catch((err)=>{
              alert(err.data.message);
            })
        },
        openModal(status, product){
          if (status === 'create'){  //判斷是編輯還是新增
            productModal.show(); //點擊後打開model
            this.isNew = true;
            //帶入初始化資料
            this.tempProduct = {
              imagesUrl: [],
            }
          } else if (status === 'edit'){
            productModal.show(); 
            this.isNew = false;
            //帶入當前要編輯的資料
            this.tempProduct = { ...product };
          } else if (status === 'delete'){
            delProductModal.show();
            this.tempProduct = { ...product }; //判斷id使用
          }
        },
    },
    mounted() {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
      axios.defaults.headers.common.Authorization = token;
        this.checkLogin();

        productModal = new bootstrap.Modal('#productModal');
        delProductModal = new bootstrap.Modal('#delProductModal');
    },
}

createApp(app).mount('#app');