export interface MenuItem {
    label: string;
    click?: () => void;
    submenu?: MenuItem[];
}

export interface AppConfig {
    title: string;
    version: string;
    menuItems: MenuItem[];
}