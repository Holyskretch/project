Vue.component('cart', {
    data() {
        return {
            cartUrl: '/getBasket.json',
            cartItems: [],
            showCart: false,
            counter: 0,
            priceCounter: 0
        }
    },
    methods: {
        addProduct(product) {

            let find = this.cartItems.find(el => el.id_product === product.id_product);
            // console.log(find);
            if (find) {
                this.$parent.putJson(`/api/cart/${find.id_product}`, {quantity: 1})
                    .then(data => {
                        if (data.result === 1) {
                            find.quantity++;
                        }
                    })
            } else {
                let prod = Object.assign({quantity: 1}, product);
                this.$parent.postJson(`/api/cart`, prod)
                    .then(data => {
                        if (data.result === 1) {
                            this.cartItems.push(prod);
                        }
                    })
            }
        },
        remove(product) {
            for (let i = 0; i < this.cartItems.length; i++) {
                if (this.cartItems[i].id_product === +product.id_product) {

                    this.$parent.deleteJson(`/api/cart/${this.cartItems[i].id_product}`, this.cartItems[i])
                        .then(data => {
                            if (data.result === 1) {
                                this.cartItems[i].quantity -= 1;
                                if (this.cartItems[i].quantity === 0) {
                                    this.cartItems.splice(i, 1)
                                }

                            }
                             this.countCart(); 
                             this.countCartPrice(); 
                        })
                }
            }
        },   
        countCart() {
            let count = 0;
            this.cartItems.forEach(item => {
                count += item.quantity;
                this.counter = count;
            })
        },
        countCartPrice() {
            let count = 0;
            this.cartItems.forEach(item => {
                count += item.quantity * item.price;
                this.priceCounter = count;
            })
        }       
    },
    mounted() {
        this.$parent.getJson(`/api/cart`)
            .then(data => {
                for (let el of data.contents) {
                    this.$data.cartItems.push(el);
                }
                this.countCart(); 
                this.countCartPrice(); 
            });
    },
    template: `
<div>
        <button class="icon-cart" type="button" @click="showCart = !showCart"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="24" viewBox="0 0 18 24">
            <path d="M17.994 5.997v14.998a3 3 0 0 1-2.999 3H3.002a3 3 0 0 1-2.999-3V5.997A2.999 2.999 0 0 1 3.002 3H4.5c0-1.657 2.013-3 4.498-3 2.484 0 4.497 1.343 4.497 3h1.5a2.999 2.999 0 0 1 2.998 2.998zM6 3h5.997c0-1.037-1.342-1.5-2.998-1.5-1.656 0-2.999.463-2.999 1.5zm10.495 16.496H1.502v1.5c0 .828.672 1.5 1.5 1.5h11.993a1.5 1.5 0 0 0 1.5-1.5zm0-13.498a1.5 1.5 0 0 0-1.5-1.5h-1.499v4.5h-1.499v-4.5H6v4.5H4.501v-4.5h-1.5a1.5 1.5 0 0 0-1.499 1.5v11.998h14.993z" />
            <path d="M17.994 5.997v14.998a3 3 0 0 1-2.999 3H3.002a3 3 0 0 1-2.999-3V5.997A2.999 2.999 0 0 1 3.002 3H4.5c0-1.657 2.013-3 4.498-3 2.484 0 4.497 1.343 4.497 3h1.5a2.999 2.999 0 0 1 2.998 2.998zM6 3h5.997c0-1.037-1.342-1.5-2.998-1.5-1.656 0-2.999.463-2.999 1.5zm10.495 16.496H1.502v1.5c0 .828.672 1.5 1.5 1.5h11.993a1.5 1.5 0 0 0 1.5-1.5zm0-13.498a1.5 1.5 0 0 0-1.5-1.5h-1.499v4.5h-1.499v-4.5H6v4.5H4.501v-4.5h-1.5a1.5 1.5 0 0 0-1.499 1.5v11.998h14.993z" /></svg>
        </button>                        
    <div class="cart-block" v-show="showCart">
        <p v-if="!cartItems.length">Cart is empty</p>
        <cart-item class="cart-item" 
            v-for="item of cartItems" 
            :key="item.id_product"
            :cart-item="item" 
            :img="item.image"
            @remove="remove">
        </cart-item>
        <span class="counter">Items in Cart : <span class="counter-item">{{ counter }}</span></span>
        <span class="priceCounter">Total amount : <span class="priceCounter-item">{{ priceCounter }} $</span></span>
    </div>
</div>`
})
;
Vue.component('cart-item', {
    props: ['cartItem', 'img'],
    template: `
                <div class="cart-item">
                    <div class="product-bio">
                        <img :src="img" alt="Some image" width="92.5px" height="59px">
                        <div class="product-desc">
                            <p class="product-title">{{cartItem.product_name}}</p>
                            <p class="product-quantity">Quantity: {{cartItem.quantity}}</p>
                            <p class="product-single-price">$ {{cartItem.price}} each</p>
                        </div>
                    </div>
                    <div class="right-block">
                        <p class="product-price">{{cartItem.quantity*cartItem.price}} $</p>
                        <button class="del-btn" @click="$emit('remove', cartItem)"><i class="fa fa-trash" aria-hidden="true"></i></button>
                    </div>
                </div>
    `
});