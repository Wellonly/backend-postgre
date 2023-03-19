// return object with model names(i.e. first letter capitalized)
// zv moved to spec: weight: 5.25, length: 12.22, width: 18.92, height: 24.47,

// TODO: fill: ProductCollection: [
//     {collection_id: 1, product_id: 1},
//     {collection_id: 1, product_id: 2},
//     {collection_id: 2, product_id: 2}
// ],

import { FOLDER_OUTBOX_ID, FOLDER_DRAFT_ID, FOLDER_BASKET_ID, FOLDER_INBOX_ID, PLACE_OUTBOX, PLACE_DRAFT, PLACE_DELETE, PLACE_INBOX } from './commonFolders';

export default {
    Collection: [
        {
            id: 1,
            name: 'Промо акции',
            slug: 'promo',
            priority: 1,
        },
        {
            id: 2,
            name: 'Хит продаж',
            slug: 'hits',
            priority: 2,
        },
        {
            id: 3,
            name: 'Лучшие новинки',
            slug: 'bestofnew',
            priority: 3,
        },
        {
            id: 4,
            name: 'Успей купить',
            slug: 'catch',
            priority: 4,
        }
    ],
    Customer: [
        {
            id: 1,
            first_name: 'Marie1',
            last_name: 'Morrison1',
            email: 'ibwerttty@ab1.net',
            address: null,
            zipcode: null,
            city: null,
            avatar: '1x32.png',
            birthday: null,
            first_seen: new Date('2014-07-21T16:15:34.479Z'),
            last_seen: new Date('2017-02-28T20:42:54.495Z'),
            has_ordered: false,
            latest_purchase: null,
            has_newsletter: true,
            groups: ['regular'],
            nb_commands: 0,
            total_spent: 0,
        },
        {
            id: 2,
            first_name: 'Frederick',
            last_name: 'Robinson',
            email: 'kibi@fumef.co.uk',
            address: null,
            zipcode: null,
            city: null,
            avatar: '2x32.png',
            birthday: null,
            first_seen: new Date('2016-12-05T18:25:35.806Z'),
            last_seen: new Date('2017-02-11T02:32:17.623Z'),
            has_ordered: false,
            latest_purchase: null,
            has_newsletter: true,
            groups: ['regular'],
            nb_commands: 0,
            total_spent: 0,
        },
        {
            id: 3,
            first_name: 'Eleanor',
            last_name: 'Gomez',
            email: 'zusep@fowu.io',
            address: null,
            zipcode: null,
            city: null,
            avatar: '3x32.png',
            birthday: null,
            first_seen: new Date('2017-03-03T20:42:54.440Z'),
            last_seen: new Date('2017-04-13T19:41:16.198Z'),
            has_ordered: false,
            latest_purchase: null,
            has_newsletter: true,
            groups: [],
            nb_commands: 0,
            total_spent: 0,
        },
        {
            id: 4,
            first_name: 'Ricky',
            last_name: 'Parks',
            email: 'ijlel@oso.edu',
            address: '635 Emotow Center',
            zipcode: '66847',
            city: 'Ubenec',
            avatar: '4x32.png',
            birthday: '1966-05-15T06:02:21.200Z',
            first_seen: new Date('2014-03-16T16:05:27.071Z'),
            last_seen: new Date('2016-02-27T12:23:13.700Z'),
            has_ordered: true,
            latest_purchase: '2016-01-28T14:59:45.200Z',
            has_newsletter: false,
            groups: ['collector'],
            nb_commands: 5,
            total_spent: 1428.4399999999998,
        },
        {
            id: 5,
            first_name: 'Ray',
            last_name: 'Barton',
            email: 'di@nagapit.co.uk',
            address: null,
            zipcode: null,
            city: null,
            avatar: '5x32.png',
            birthday: null,
            first_seen: new Date('2017-04-05T19:38:25.633Z'),
            last_seen: new Date('2017-04-24T03:17:29.973Z'),
            has_ordered: false,
            latest_purchase: null,
            has_newsletter: true,
            groups: [],
            nb_commands: 0,
            total_spent: 0,
        },
    ],
    Category: [
        {
            id: 1,
            name: 'Солнцезащитные',
            slug: 'solar',
            priority: 1,
        },
        {
            id: 2,
            name: 'Компьютерные',
            slug: 'pc',
            priority: 2,
        },
        {
            id: 3,
            name: 'Спортивные',
            slug: 'sport',
            priority: 3,
        },
        {
            id: 4,
            name: 'Цветные',
            slug: 'colour',
            priority: 4,
        },
        {
            id: 5,
            name: 'Эстрадные',
            slug: 'pop',
            priority: 5,
        },
    ],
    Product: [
        {
            id: 1,
            category_id: 1,
            sku: 'ab-z8fqk-C',
            title: 'Product 1 title',
            slug: 'product-1',
            variant: 'variant1',
            priority: 1,
            highprice: 10.01,
            price: 11.82,
            optprice: 10.01,
            optfrom: 1,
            stock: 111,
            weight: 110,
            length: 110,
            width: 110,
            height: 50,
            video: '',
            images: '1x512.png',
            description: 'description 1',
            spec: '',
            artimages: '',
            article: '',
        },
        {
            id: 2,
            category_id: 2,
            sku: 'ab-ky46t-I',
            title: 'Product 2 title',
            slug: 'product-2',
            variant: 'variant2',
            priority: 2,
            highprice: 32.02,
            price: 22.59,
            optprice: 20.02,
            optfrom: 2,
            stock: 222,
            weight: 112,
            length: 112,
            width: 112,
            height: 52,
            video: '',
            images: '2x512.png,1x512.png',
            description: 'description 2',
            spec: '',
            artimages: '',
            article: '',
        },
        {
            id: 3,
            category_id: 3,
            sku: 'ab-h0knu-Y',
            title: 'Product 3 title',
            slug: 'product-3',
            variant: 'variant3',
            priority: 3,
            highprice: 43.03,
            price: 33.49,
            optprice: 30.03,
            optfrom: 3,
            stock: 0,
            weight: 113,
            length: 113,
            width: 113,
            height: 53,
            video: '',
            images: '3x512.png',
            description: 'description 3',
            spec: '',
            artimages: '',
            article: '',
        },
        {
            id: 4,
            category_id: 4,
            sku: 'ab-oz3y0-Q',
            title: 'Product 4 title',
            slug: 'product-4',
            variant: 'variant4',
            priority: 4,
            highprice: 54.04,
            price: 44.42,
            optprice: 40.01,
            optfrom: 4,
            stock: 444,
            weight: 114,
            length: 114,
            width: 114,
            height: 54,
            video: '',
            images: '4x512.png',
            description: 'description 4',
            spec: '',
            artimages: '',
            article: '',
        },
        {
            id: 5,
            category_id: 5,
            sku: 'ab-lkiy2-I',
            title: 'Product 5 title',
            slug: 'product-5',
            variant: 'variant5',
            priority: 5,
            highprice: 65.05,
            price: 55.21,
            optprice: 50.05,
            optfrom: 5,
            stock: 555,
            weight: 115,
            length: 115,
            width: 115,
            height: 55,
            video: '',
            images: '5x512.png',
            description: 'description 5',
            spec: '',
            artimages: '',
            article: '',
        },
    ],
    Command: [
        {
            id: 1,
            sku: 'i7fd2p',
            date: new Date('2015-03-27T22:20:37.135Z'),
            customer_id: 1,
            basket: [
                {
                    product_id: 1,
                    quantity: 1,
                },
            ],
            total_ex_taxes: 19.29,
            delivery_fees: 7.23,
            tax_rate: 0.2,
            taxes: 5.3,
            total: 31.82,
            status: 'delivered',
            returned: true,
        },
        {
            id: 2,
            sku: 'xc30t9',
            date: new Date('2017-03-04T20:59:08.628Z'),
            customer_id: 2,
            basket: [
                {
                    product_id: 2,
                    quantity: 1,
                },
            ],
            total_ex_taxes: 58.98,
            delivery_fees: 6.44,
            tax_rate: 0.12,
            taxes: 7.85,
            total: 73.27,
            status: 'delivered',
            returned: false,
        },
        {
            id: 3,
            sku: 'a9cj0p',
            date: new Date('2016-12-31T15:43:48.694Z'),
            customer_id: 3,
            basket: [
                {
                    product_id: 3,
                    quantity: 2,
                },
            ],
            total_ex_taxes: 168.46,
            delivery_fees: 3.94,
            tax_rate: 0.12,
            taxes: 20.69,
            total: 193.09,
            status: 'delivered',
            returned: false,
        },
        {
            id: 4,
            sku: '0x93aj',
            date: new Date('2016-11-20T13:07:36.165Z'),
            customer_id: 4,
            basket: [
                {
                    product_id: 4,
                    quantity: 3,
                },
                {
                    product_id: 5,
                    quantity: 3,
                },
            ],
            total_ex_taxes: 153.63,
            delivery_fees: 4.29,
            tax_rate: 0.12,
            taxes: 18.95,
            total: 176.87,
            status: 'cancelled',
            returned: false,
        },
        {
            id: 5,
            sku: 'us9i5l',
            date: new Date('2017-04-03T04:29:23.095Z'),
            customer_id: 5,
            basket: [
                {
                    product_id: 5,
                    quantity: 3,
                },
                {
                    product_id: 1,
                    quantity: 1,
                },
            ],
            total_ex_taxes: 241.95999999999998,
            delivery_fees: 4.94,
            tax_rate: 0.17,
            taxes: 41.97,
            total: 288.87,
            status: 'delivered',
            returned: false,
        },
    ],
    Invoice: [
        {
          "id": 1,
          "date": "2016-01-20T09:23:22.865Z",
          "command_id": 1,
          "customer_id": 1,
          "total_ex_taxes": 230.57000000000002,
          "delivery_fees": 7.57,
          "tax_rate": 0.17,
          "taxes": 40.48,
          "total": 278.62
        },
        {
          "id": 2,
          "date": "2016-03-06T13:51:12.815Z",
          "command_id": 2,
          "customer_id": 2,
          "total_ex_taxes": 492.96000000000004,
          "delivery_fees": 6.11,
          "tax_rate": 0.17,
          "taxes": 84.84,
          "total": 583.91
        },
        {
          "id": 3,
          "date": "2016-07-06T20:47:55.374Z",
          "command_id": 3,
          "customer_id": 3,
          "total_ex_taxes": 74.65,
          "delivery_fees": 3.68,
          "tax_rate": 0.12,
          "taxes": 9.4,
          "total": 87.73
        },
        {
          "id": 4,
          "date": "2016-07-23T20:05:58.854Z",
          "command_id": 4,
          "customer_id": 4,
          "total_ex_taxes": 125.52000000000001,
          "delivery_fees": 4.21,
          "tax_rate": 0.2,
          "taxes": 25.95,
          "total": 155.68
        },
        {
          "id": 5,
          "date": "2016-08-12T01:46:56.457Z",
          "command_id": 5,
          "customer_id": 5,
          "total_ex_taxes": 25.74,
          "delivery_fees": 5.93,
          "tax_rate": 0.17,
          "taxes": 5.38,
          "total": 37.05
        },
    ],
    Review: [
        {
            id: 1,
            date: new Date('2017-03-21T04:54:26.148Z'),
            status: 'accepted',
            command_id: 1,
            product_id: 1,
            customer_id: 1,
            rating: 2,
            comment: 'Review 1',
        },
        {
            id: 2,
            date: new Date('2017-03-20T15:46:43.340Z'),
            status: 'accepted',
            command_id: 2,
            product_id: 2,
            customer_id: 2,
            rating: 4,
            comment: 'Review 2',
        },
        {
            id: 3,
            date: new Date('2017-02-15T18:22:36.613Z'),
            status: 'accepted',
            command_id: 3,
            product_id: 3,
            customer_id: 3,
            rating: 2,
            comment: 'Review 3',
        },
        {
            id: 4,
            date: new Date('2017-03-25T18:05:20.178Z'),
            status: 'accepted',
            command_id: 4,
            product_id: 4,
            customer_id: 4,
            rating: 2,
            comment: 'Review 4',
        },
        {
            id: 5,
            date: new Date('2017-02-05T15:41:59.536Z'),
            status: 'accepted',
            command_id: 5,
            product_id: 5,
            customer_id: 5,
            rating: 1,
            comment: 'Review 5',
        },
    ],
    Setting: [
        {
            id: 1,
            configuration: {
                url: 'http://example.com/',
                mail: {
                    sender: 'email@example.com',
                    transport: {
                        service: 'fakemail',
                        auth: {
                            user: 'ex@example.com',
                            pass: 'f00b123',
                        },
                    },
                },
                file_type_whiltelist: [
                    'txt',
                    'doc',
                    'docx',
                    'xls',
                    'xlsx',
                    'pdf',
                    'png',
                    'jpg',
                ],
            },
        },
    ],
    Link: [
        {
            id: 1,
            menu: 'top',
            priority: 1,
            label: 'TheBest',
            icon: '',
            slug: '/',
            component: '',
            images: '',
            template: '',
            content: '',
        },
        {
            id: 2,
            menu: 'top',
            priority: 99,
            label: 'Cart',
            icon: '',
            slug: 'cart',
            component: '',
            images: '',
            template: '',
            content: '',
        },
        {
            id: 3,
            menu: 'top',
            priority: 3,
            label: 'Doc1',
            icon: '',
            slug: 'doc1',
            component: '',
            images: '',
            template: '',
            content: '',
        },
        {
            id: 4,
            menu: 'top',
            priority: 4,
            label: 'Doc2',
            icon: '',
            slug: 'doc2',
            component: '',
            images: '',
            template: '',
            content: '',
        },
        {
            id: 5,
            menu: 'top',
            priority: 5,
            label: 'Коллекции',
            icon: '',
            slug: 'collections',
            component: 'Button',
            images: '',
            template: '',
            content: '',
        },
        {
            id: 6,
            menu: 'top',
            priority: 6,
            label: 'Категории',
            icon: '',
            slug: 'categories',
            component: 'Button',
            images: '',
            template: '',
            content: '',
        },
        {
            id: 7,
            menu: 'left',
            priority: 1,
            label: 'Коллекции',
            icon: 'MdFolderSpecial',
            slug: 'collections',
            component: 'list',
            images: '',
            template: '',
            content: '',
        },
        {
            id: 8,
            menu: 'left',
            priority: 2,
            label: 'Категории',
            icon: 'MdFolderSpecial',
            slug: 'categories',
            component: 'list',
            images: '',
            template: '',
            content: '',
        },
        {
            id: 9,
            menu: 'left',
            priority: 3,
            label: 'разделитель',
            icon: '',
            slug: '',
            component: 'divider',
            images: '',
            template: '',
            content: 'пример разделителя',
        },
        {
            id: 10,
            menu: 'left',
            priority: 4,
            label: 'ЗАГОЛОВОК',
            icon: '',
            slug: '',
            component: 'title',
            images: '',
            template: '',
            content: 'пример заголовка',
        },
        {
            id: 11,
            menu: 'bottom',
            priority: 1,
            label: 'Информация',
            icon: 'MdInfo',
            slug: '',
            component: '',
            images: '',
            template: '',
            content: '',
        },
        {
            id: 12,
            menu: 'bottom',
            priority: 2,
            label: 'Мы в сети',
            icon: 'MdPeople',
            slug: '',
            component: '',
            images: '',
            template: '',
            content: '',
        },
        {
            id: 13,
            menu: 'bottom',
            priority: 3,
            label: 'Блог',
            icon: 'MdBlog',
            slug: 'posts',
            component: '',
            images: '',
            template: '',
            content: '',
        },
    ],
    Sublink: [
        {
            id: 1,
            link_id: 11,
            priority: 1,
            label: 'Документ1',
            icon: '',
            slug: 'info-doc1',
            component: '',
            images: '',
            template: '',
            content: '',
        },
        {
            id: 2,
            link_id: 11,
            priority: 2,
            label: 'Документ2',
            icon: '',
            slug: 'info-doc2',
            component: '',
            images: '',
            template: '',
            content: '',
        },
        {
            id: 3,
            link_id: 12,
            priority: 1,
            label: 'VK',
            icon: 'FcContacts',
            slug: 'https://vk.com',
            component: '',
            images: '',
            template: '',
            content: '',
        },
        {
            id: 4,
            link_id: 12,
            priority: 2,
            label: 'Instagram',
            icon: 'FaInstagram',
            slug: 'https://instagram.com',
            component: '',
            images: '',
            template: '',
            content: '',
        },
        {
            id: 5,
            link_id: 13,
            priority: 1,
            label: '#vim-labs',
            icon: '',
            slug: '/tag/vim-labs',
            component: '',
            images: '',
            template: '',
            content: '',
        },
        {
            id: 6,
            link_id: 13,
            priority: 2,
            label: '#even-number',
            icon: '',
            slug: '/tag/even-number',
            component: '',
            images: '3x512.png',
            template: '',
            content: `# Привет MDX!!!
<Image src="3x512.png"/>
            `,
        },
    ],
    Carrier: [
        {
            id: 1,
            priority: 1,
            title: 'Самовывоз',
            descript: 'Самовывоз из магазина',
            icon: '',
            slug: 'carry-self',
            calc: '0', /* zero means pick up by self */
            images: 'carry-self-icon.png,carry-self.png',
            template: '',
            content: '',
        },
        {
            id: 2,
            priority: 2,
            title: 'Курьер',
            descript: 'Доставка курьером',
            icon: '',
            slug: 'carry-taxi',
            calc: 'Math.max(500,weight*distance*100)',  /* <=0 means: not available */
            images: 'carry-taxi-icon.png,carry-taxi.png',
            template: '',
            content: '',
        },
        {
            id: 3,
            priority: 3,
            title: 'Почта России',
            descript: 'Доставка Почтой России',
            icon: '',
            slug: 'carry-post',
            calc: '{return Math.max(1000,weight*distance*100);}',
            images: 'carry-post-icon.png,carry-post.png',
            template: '',
            content: '',
        },
        {
            id: 4,
            priority: 4,
            title: 'CDEK',
            descript: 'Транспортная компания CDEK',
            icon: '',
            slug: 'carry-cdec',
            calc: '{return Math.max(1200,weight*distance*100);}',
            images: 'carry-cdek-icon.png,carry-cdek.png',
            template: '',
            content: `
            Каким образом происходит расчет веса груза?

            Расчёт стоимости доставки производится исходя из условий тарифа и наибольшего значения веса груза (физического или объемного). Также, стоит учитывать, что округление веса производится в большую сторону. Исключением является груз до 0.5 кг (например 0.2 кг), он округляется до 0.5 кг.
            
            Объемный вес измеряется в килограммах и считается по формуле:
            (длина * ширина * высота)/5000
            Пример: длина - 20, ширина - 10, высота - 5. Объемный вес = (20*10*5)/5000=0,2 кг
            
            Разберём на конкретном примере:
            Физ. Вес = 2 кг, Длина = 45 см, Ширина = 25 см, Высота = 20 см
            
            Получается, Об. вес = 4,5 кг. Округляем, получаем 5 кг.
            
            Объемный вес больше физического, следовательно расчет будет проводиться по объемному весу.
            `,
        },
        {
            id: 5,
            priority: 5,
            title: 'dpd',
            descript: 'Транспортная компания dpd',
            icon: '',
            slug: 'carry-dpd',
            calc: '{return Math.max(1300,weight*distance*100);}',
            images: 'carry-dpd-icon.png,carry-dpd.png',
            template: '',
            content: '',
        },
    ],
    Paymethod: [
    {
      id: 1,
      priority: 1,
      title: 'Наличные',
      descript: 'Оплата наличными',
      icon: '',
      slug: 'pay-by-cash',
      calc: '1',
      images: 'pay-by-cash-icon.png,pay-by-cash.png',
      template: '',
      content: '',
    },
    {
      id: 2,
      priority: 2,
      title: 'Картой при получении',
      descript: 'Оплата картой при получении',
      icon: '',
      slug: 'pay-by-card-on-delivery',
      calc: '2',
      images: 'pay-by-card-on-delivery-icon.png,pay-by-card-on-delivery.png',
      template: '',
      content: '',
    },
    {
      id: 3,
      priority: 3,
      title: 'Картой онлайн',
      descript: 'Оплата картой онлайн',
      icon: '',
      slug: 'pay-by-card-online',
      calc: '3',
      images: 'pay-by-card-online-icon.png,pay-by-card-online.png',
      template: '',
      content: '',
    },
    ],
    Option: [
      {
        id: 1,
        group: 'system',
        name: 'MEDIA_HOST_URL',
        datatype: 'string',
        value: 'http://localhost:8002/',
        descript: 'self',
      },
      {
        id: 2,
        group: 'system',
        name: 'language',
        datatype: 'string',
        value: 'ru',
        descript: 'options: en, ru',
      },
      {
        id: 3,
        group: 'system',
        name: 'country',
        datatype: 'string',
        value: 'RU',
        descript: 'ISO 3166 Alpha-2 code: US, RU, so on...',
      },
    ],
    Office: [
        {
            id: 1,
            city_id: 1,
            priority: 1,
            services: 1,
            title: 'Mosc-Магазин',
            descript: 'Магазин №1',
            address: 'ул Мира, д 1',
            latitude: 55.755,
            longitude: 37.617,
            worktime: '1-7:9-19',
            phone: '755-55-55, 733-33-33',
            slug: '',
            images: '',
            template: '',
            content: ''
        },
        {
            id: 2,
            city_id: 2,
            priority: 2,
            services: 2,
            title: 'Stav-Магазин',
            descript: 'Магазин №2',
            address: 'ул Мира, д 2',
            latitude: 45.0,
            longitude: 41.0,
            worktime: '1-7:8-18',
            phone: '55-55-55, 33-33-33',
            slug: '',
            images: '',
            template: '',
            content: ''
        },
    ],
    Folder: [
        {
            id: FOLDER_OUTBOX_ID,
            user_id: 1,
            priority: 2,
            place: PLACE_OUTBOX,
            name: 'Исходящие',
            icon: 'outcoming',
            color: '#ffff00',
            slug: 'outcoming',
            filter: 'outcoming',
        },
        {
            id: FOLDER_DRAFT_ID,
            user_id: 1,
            priority: 3,
            place: PLACE_DRAFT,
            name: 'Черновики',
            icon: 'draft',
            color: '#ffff80',
            slug: 'draft',
            filter: 'draft',
        },
        {
            id: FOLDER_BASKET_ID,
            user_id: 1,
            priority: 4,
            place: PLACE_DELETE,
            name: 'Корзина',
            icon: 'basket',
            color: '#ffffff',
            slug: 'trash',
            filter: 'trash',
        },
        {
            id: FOLDER_INBOX_ID,
            user_id: 1,
            priority: 1,
            place: PLACE_INBOX,
            name: 'Входящие',
            icon: 'incoming',
            color: '#ff0000',
            slug: 'incoming',
            filter: 'incoming',
        },
    ],
    Message: [
        {
            id: 1,
            user_id: 1,
            folder_id: FOLDER_OUTBOX_ID,
            to_id: 2,
            inbox_id: FOLDER_INBOX_ID,
            title: 'Hi from bot to Well',
            text: 'Hi Well! (bot)',
            sentAt: new Date('2020-08-13T12:21:37.135Z'),
        },
        {
            id: 2,
            user_id: 2,
            folder_id: FOLDER_OUTBOX_ID,
            to_id: 1,
            inbox_id: FOLDER_INBOX_ID,
            title: 'Hi from Well to Bot',
            text: 'Hi Bot! (Well)',
            sentAt: new Date('2020-08-13T12:22:37.135Z'),
          },
          {
            id: 3,
            user_id: 2,
            folder_id: FOLDER_OUTBOX_ID,
            to_id: 3,
            inbox_id: FOLDER_INBOX_ID,
            title: 'Hi from Well to Alex',
            text: 'Hi Alex! (Well)',
            sentAt: new Date('2020-08-13T12:23:37.135Z'),
          },
          {
            id: 4,
            user_id: 3,
            folder_id: FOLDER_OUTBOX_ID,
            to_id: 2,
            inbox_id: FOLDER_INBOX_ID,
            title: 'Hi from Alex to Well',
            text: 'Hi Well! (Alex)',
            sentAt: new Date('2020-08-13T12:24:37.135Z'),
            readAt: new Date('2020-08-13T12:24:47.135Z'),
          },
          {
            id: 5,
            user_id: 4,
            folder_id: FOLDER_OUTBOX_ID,
            to_id: 2,
            inbox_id: FOLDER_INBOX_ID,
            title: 'Hi from Oleg to Well',
            text: 'Hi Well! (Oleg)',
            sentAt: new Date('2020-08-13T12:25:37.135Z'),
          },
          {
            id: 6,
            user_id: 2,
            folder_id: FOLDER_DRAFT_ID,
            to_id: null,
            inbox_id: null,
            title: 'Hi from Well to ...',
            text: 'Hi ...! (Well)',
          },
          {
            id: 7,
            user_id: 1,
            folder_id: FOLDER_OUTBOX_ID,
            to_id: 1,
            inbox_id: FOLDER_INBOX_ID,
            title: 'Hi from anonim to Bot',
            text: 'Hi Bot! (Anonimous)',
            sentAt: new Date('2020-08-13T12:27:37.135Z'),
          },
    ],
};
