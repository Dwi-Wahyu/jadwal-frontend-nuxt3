export interface MenuItem {
    title: string;
    icon?: string;
    icon2?: string;
    route: string;
    child?: any;
    roles: any;
    type: string; 
  }
  
  export const menuItems: MenuItem[] = [
    { title: 'Dashboard', icon: 'Dashboard-active',icon2: 'Dashboard-inactive', route: '/', child : [], roles : [], type: 'parent' },
    { title: 'Manajemen Data', icon: '',icon2: '', route: '', child : [], roles: [], type: 'menuName' },
    { title: 'Laporan', icon: 'Laporan-active',icon2: 'Laporan-inactive', route: '/laporan', child : [], roles: [], type: 'parent' },
    { title: 'Kelola Data', icon: 'Laporan-active',icon2: 'Laporan-inactive', route: '/kelola-data', child : [
        {
            title: 'Data Penduduk',
            route: '/kelola-data/penduduk'
        },{
            title: 'Data Infrastruktur',
            route: '/kelola-data/infrastruktur'
        },
    ], roles : [], type: 'parent' }
  ];
  