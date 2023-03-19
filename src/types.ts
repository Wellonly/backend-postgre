
import { PLACE } from './seed/commonFolders';
export type ReviewStatus = 'accepted' | 'pending' | 'rejected';

export declare type ID = number;

export interface Record {
    id: ID;
    createdAt: Date;
    updatedAt: Date;
    [key: string]: any;
}

export interface User extends Record {
    priority: number;
    username: string;
    email: string;
    phone: string;
    email2: string;
    phone2: string;
    password: string;
    role: string;
    descript: string;
}

export interface Message extends Record {
    user_id: ID;
    folder_id: ID;
    to_id: ID;
    inbox_id: ID;
    sentAt: Date;
    readAt: Date;
    title: string;
    text: string;
}

/* TODO: engage on demand; check field types, especial strings...
export interface Review extends Record {
    date: Date;
    status: ReviewStatus;
    customer_id: ID;
    product_id: ID;
}

export interface Option extends Record {
    group: string;
    name: string;
    datatype: string;
    value: string;
    descript: string;
}
export interface Folder extends Record {
    user_id: ID;
    priority: number;
    place: PLACE;
    name: string;
    icon: string;
    color: string;
    slug: string;
    filter: string;
}

export interface Link extends Record {
    label: string;
    icon: string;
    slug: string;
    component: string;
    menu: number;
    priority: number;
    template: string;
    content: string;
    images: string;
}

export interface Category extends Record {
    name: string;
    slug: string;
    priority: number;
}

export interface Office extends Record {
    city_id: ID;
    priority: number;
    services: number;
    title: string;
    descript: string;
    address: string;
    latitude: number;
    longitude: number;
    worktime: string;
    phone: string;
    slug: string;
    images: string;
    template: string;
    content: string;
}

export interface City extends Record {
    name: string;
    area: string;
    countryCode: string;
    phone: number;
    postal: number;
    latitude: number;
    longitude: number;
    rating: number;
}

export interface Collection extends Record {
    name: string;
    slug: string;
    priority: number;
}

export interface Product extends Record {
    category_id: ID;
    sku: string;
    title: string;
    slug: string;
    variant: string;
    priority: number;
    highprice: number;
    price: number;
    optprice: number;
    optfrom: number;
    video: string;
    images: string;
    description: string;
    stock: number;
    spec: string;
}

export interface Customer extends Record {
    first_name: string;
    last_name: string;
    address: string;
    city: string;
    zipcode: string;
    avatar: string;
    birthday: string;
    first_seen: string;
    last_seen: string;
    has_ordered: boolean;
    latest_purchase: string;
    has_newsletter: boolean;
    groups: string[];
    nb_commands: number;
    total_spent: number;
}
*/