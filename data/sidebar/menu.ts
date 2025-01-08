export interface MenuItem {
  title: string;
  icon: string;
  icon2: string;
  route: string;
  child?: any;
  roles: any;
  type: string;
}

export const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: "Dashboard-active",
    icon2: "Dashboard-inactive",
    route: "/dashboard",
    child: [],
    roles: ["Admin", "Umum"],
    type: "parent",
  },
  {
    title: "Ruangan",
    icon: "Ruangan-active",
    icon2: "Ruangan-inactive",
    route: "/ruangan",
    child: [],
    roles: ["Admin"],
    type: "parent",
  },
  {
    title: "Peminjaman",
    icon: "Peminjaman-active",
    icon2: "Peminjaman-inactive",
    route: "/peminjaman",
    child: [],
    roles: ["Admin"],
    type: "parent",
  },
  {
    title: "Jadwal",
    icon: "Jadwal-active",
    icon2: "Jadwal-inactive",
    route: "/jadwal",
    child: [],
    roles: ["Admin", "Umum"],
    type: "parent",
  },
  {
    title: "Pengguna",
    icon: "Pengguna-active",
    icon2: "Pengguna-inactive",
    route: "/pengguna",
    child: [],
    roles: ["Admin"],
    type: "parent",
  },
];
