const kb = require('./keyboard-buttons')

module.exports = {
  language: [
    [kb.language.uz, kb.language.ru]
  ],

  main: {
    uz: [[kb.main.uz]],
    ru: [[kb.main.ru]]
  },

  start: [[kb.start]],

  user: {
    pages: {
      uz: [
        [kb.user.pages.uz.settings, kb.user.pages.uz.feedback],
        [kb.user.pages.uz.orders, kb.user.pages.uz.products],
        [kb.user.pages.uz.report, kb.user.pages.uz.location],
        [kb.user.pages.uz.basket]
      ],

      ru: [
        [kb.user.pages.ru.settings, kb.user.pages.ru.feedback],
        [kb.user.pages.ru.orders, kb.user.pages.ru.products],
        [kb.user.pages.ru.report, kb.user.pages.ru.location],
        [kb.user.pages.ru.basket]
      ]
    },

    orders: {
      uz: [
        [kb.user.orders.uz.should_accept, kb.user.orders.uz.my_orders],
        [kb.main.uz]
      ],

      ru: [
        [kb.user.orders.ru.should_accept, kb.user.orders.ru.my_orders],
        [kb.main.ru]
      ]
    },

    reports: {
      uz: [
        [kb.user.reports.uz.number],
        [kb.user.reports.uz.delivered, kb.user.reports.uz.accepted],
        [kb.main.uz]
      ],
      ru: [
        [kb.user.reports.ru.number],
        [kb.user.reports.ru.delivered, kb.user.reports.ru.accepted],
        [kb.main.ru]
      ]
    },

    feedback: {
      uz: [
        [kb.user.feedback.uz.add, kb.user.feedback.uz.my_feedback],
        [kb.main.uz]
      ],

      ru: [
        [kb.user.feedback.ru.add, kb.user.feedback.ru.my_feedback],
        [kb.main.ru]
      ]
    },

    products: {
      uz: [
        [kb.user.products.uz.all, kb.user.products.uz.my],
        [kb.main.uz]
      ],

      ru: [
        [kb.user.products.ru.all, kb.user.products.ru.my],
        [kb.main.ru]
      ]
    },

    settings: {
      uz: [
        [kb.user.settings.uz.name, kb.user.settings.uz.number, kb.user.settings.uz.language],
        [kb.main.uz]
      ],

      ru: [
        [kb.user.settings.ru.name, kb.user.settings.ru.number, kb.user.settings.ru.language],
        [kb.main.ru]
      ]
    },
  },

  super_admin: {
    pages: [
      [kb.super_admin.pages.settings, kb.super_admin.pages.branch],
      [kb.super_admin.pages.users, kb.super_admin.pages.advertising],
      [kb.super_admin.pages.admins]
    ],

    settings: [
      [kb.admin.settings.name, kb.admin.settings.number],
      [kb.main.uz]
    ],

    branch: [
      [kb.super_admin.branch.add, kb.super_admin.branch.all],
      [kb.main.uz]
    ],

    users: [
      [kb.super_admin.users.number],
      [kb.main.uz]
    ],

    advertising: [
      [kb.super_admin.advertising.add],
      [kb.super_admin.advertising.all, kb.super_admin.advertising.number],
      [kb.main.uz]
    ],

    admins: [
      [kb.super_admin.admins.add, kb.super_admin.admins.all],
      [kb.main.uz]
    ]
  },

  admin: {
    pages: [
      [kb.admin.pages.settings, kb.admin.pages.advertising],
      [kb.admin.pages.orders, kb.admin.pages.products],
      [kb.admin.pages.users, kb.admin.pages.feedback, kb.admin.pages.employee]
    ],
    settings: [
      [kb.admin.settings.name, kb.admin.settings.number],
      [kb.main.uz]
    ],
    orders: [
      [kb.admin.orders.number, kb.admin.orders.confirm_deliver],
      [kb.main.uz]
    ],
    users: [
      [kb.admin.users.number],
      [kb.main.uz]
    ],
    products: [
      [kb.admin.products.add, kb.admin.products.all],
      [kb.main.uz]
    ],
    advertising: [
      [kb.admin.advertising.add],
      [kb.admin.advertising.all, kb.admin.advertising.number],
      [kb.main.uz]
    ],
    feedback: [
      [kb.admin.feedback.number],
      [kb.main.uz]
    ],
    employee: [
      [kb.admin.employee.all, kb.admin.employee.add],
      [kb.main.uz]
    ],

  },

  employee: {
    pages: [
      [kb.employee.pages.settings, kb.employee.pages.feedback],
      [kb.employee.pages.products, kb.employee.pages.orders],
    ],

    settings: [
      [kb.employee.settings.name, kb.employee.settings.number],
      [kb.main.uz]
    ],

    feedback: [
      [kb.employee.feedback.add, kb.employee.feedback.my_feedback],
      [kb.main.uz]
    ],

    products: [
      [kb.employee.products.all],
      [kb.main.uz]
    ],

    orders: [
      [kb.employee.orders.my_orders, kb.employee.orders.delivered],
      [kb.main.uz]
    ],
  },

  options: {
    allow: {
      uz: [
        [kb.options.allow.uz.yes, kb.options.allow.uz.no]
      ],

      ru: [
        [kb.options.allow.ru.yes, kb.options.allow.ru.no]
      ]
    },

    order: {
      uz: [
        [kb.options.order.uz.order, kb.options.order.uz.clear],
        [kb.options.order.uz.edit, kb.main.uz]
      ],

      ru: [
        [kb.options.order.ru.order, kb.options.order.ru.clear],
        [kb.options.order.ru.edit, kb.main.ru]
      ]
    },

    feedback: {
      uz: [
        [kb.options.feedback.uz.good, kb.options.feedback.uz.bad],
        [kb.options.back.uz]
      ],

      ru: [
        [kb.options.feedback.ru.good, kb.options.feedback.ru.bad],
        [kb.options.back.ru]
      ]
    },

    situation: {
      uz: [
        [kb.options.situation.uz.increase, kb.options.situation.uz.decrease, kb.options.situation.uz.destroy],
        [kb.options.back.uz]
      ],

      ru: [
        [kb.options.situation.ru.increase, kb.options.situation.ru.decrease, kb.options.situation.ru.destroy],
        [kb.options.back.ru]
      ]
    },

    condition: {
      uz: [
        [kb.options.condition.uz.true],
        [kb.options.condition.uz.false]
      ],

      ru: [
        [kb.options.condition.ru.true],
        [kb.options.condition.ru.false]
      ]
    },

    back: {
      uz: [[kb.options.back.uz]],
      ru: [[kb.options.back.ru]],
    },

    confirmation: {
      uz: [[kb.options.confirmation.uz, kb.options.not_to_confirmation.uz]],
      ru: [[kb.options.confirmation.ru, kb.options.not_to_confirmation.ru]]
    },

    confirmation_admin: [
      [kb.options.confirmation.uz, kb.options.not_to_confirmation.uz]
    ],
    confirmation_advertising: [
      [kb.options.confirmation_advertising.yes, kb.options.confirmation_advertising.no]
    ],

    task: [
      [kb.options.task.baker, kb.options.task.dough_maker],
      [kb.options.back.uz, kb.options.task.supplier]
    ],

    back_employee: [[kb.options.back.ru]],

    delivered: [[kb.options.delivered]]
  }
}
