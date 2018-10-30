export default {
  route: {
    dashboard: 'Dashboard',
    system: 'Settings',
    menu: 'Menu',
    dept: 'Dept',
    role: 'Role',
    user: 'User',
    under: 'Under',
    conf: 'Config',
    druid: 'Druid Log',
    center: 'My Page',
    flow: 'Flow',
    model: 'Model',
    deploy: 'Deploy',
    start: 'Start',
    mine: 'Mine',
    task: 'Task',
    wait: 'Wait',
    past: 'Past',
    global: 'Global',
    number: 'Number',
    store: 'Store',
    goods: 'Goods',
    supplier: 'Supplier',
    work: 'Work',
    leave: 'Leave',
    purchase: 'Purchase',
    contract: 'Contract',
    furlough: 'Furlough',
    page401: '401',
    page404: '404'
  },
  navbar: {
    myPage: 'My Page',
    logOut: 'Log Out',
    dashboard: 'Dashboard',
    github: 'Github',
    screenFull: 'screenfull',
    langSelect: 'language',
    theme: 'theme'
  },
  login: {
    title: 'Sign in to Six',
    logIn: 'Sign in',
    username: 'Username/Phone/Mail',
    password: 'Password',
    remember: 'Remember the password',
    forget: 'Forget the password?',
    mail: 'Please enter the account bound mailbox',
    code: 'Identifying code',
    reset: 'Reset password',
    toLogin: 'Go to the login page'
  },
  documentation: {
    documentation: 'Documentation',
    github: 'Github Repository'
  },
  permission: {
    roles: 'Your roles',
    switchRoles: 'Switch roles'
  },
  components: {
    documentation: 'Documentation',
    tinymceTips: 'Rich text editor is a core part of management system, but at the same time is a place with lots of problems. In the process of selecting rich texts, I also walked a lot of detours. The common rich text editors in the market are basically used, and the finally chose Tinymce. See documentation for more detailed rich text editor comparisons and introductions.',
    dropzoneTips: 'Because my business has special needs, and has to upload images to qiniu, so instead of a third party, I chose encapsulate it by myself. It is very simple, you can see the detail code in @/module/Dropzone.',
    stickyTips: 'when the page is scrolled to the preset position will be sticky on the top.',
    backToTopTips1: 'When the page is scrolled to the specified position, the Back to Top button appears in the lower right corner',
    backToTopTips2: 'You can customize the style of the button, show / hide, height of appearance, height of the return. If you need a text prompt, you can use element-ui el-tooltip elements externally',
    imageUploadTips: 'Since I was using only the vue@1 version, and it is not compatible with mockjs at the moment, I modified it myself, and if you are going to use it, it is better to use official version.'
  },
  table: {
    dynamicTips1: 'Fixed header, sorted by header order',
    dynamicTips2: 'Not fixed header, sorted by click order',
    dragTips1: 'The default order',
    dragTips2: 'The after dragging order',
    title: 'Title',
    importance: 'Imp',
    type: 'Type',
    remark: 'Remark',
    search: 'Search',
    add: 'Add',
    export: 'Export',
    reviewer: 'reviewer',
    id: 'ID',
    date: 'Date',
    author: 'Author',
    readings: 'Readings',
    status: 'Status',
    actions: 'Actions',
    edit: 'Edit',
    publish: 'Publish',
    draft: 'Draft',
    delete: 'Delete',
    cancel: 'Cancel',
    confirm: 'Confirm'
  },
  errorLog: {
    tips: 'Please click the bug icon in the upper right corner',
    description: 'Now the management system are basically the form of the spa, it enhances the user experience, but it also increases the possibility of page problems, a small negligence may lead to the entire page deadlock. Fortunately Vue provides a way to catch handling exceptions, where you can handle errors or report exceptions.',
    documentation: 'Document introduction'
  },
  excel: {
    export: 'Export',
    selectedExport: 'Export selected items',
    placeholder: 'Please enter the file name(default excel-list)'
  },
  zip: {
    export: 'Export',
    placeholder: 'Please enter the file name(default file)'
  },
  theme: {
    change: 'Theme change',
    documentation: 'Theme documentation',
    tips: 'Tips: It is different from the theme-pick on the navbar is two different skinning methods, each with different application scenarios. Refer to the documentation for details.'
  },
  tagsView: {
    close: 'Close',
    closeOthers: 'Close Others',
    closeAll: 'Close All'
  }
}
