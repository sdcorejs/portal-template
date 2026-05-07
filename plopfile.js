const fs = require('fs');
const path = require('path');

module.exports = function (plop) {
  const libChoices = fs.readdirSync('src/libs').filter(name => {
    return fs.statSync(`src/libs/${name}`).isDirectory();
  });

  // ============================================================
  // 1. GENERATOR: TẠO MODULE (LIB)
  // ============================================================
  plop.setGenerator('module', {
    description: 'Tạo cấu trúc chuẩn cho một Library/Module mới',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Nhập tên module (vd: scm, clm, sales-platform):',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/libs/{{dashCase name}}/routes.ts',
        templateFile: 'plop-templates/module/routes.ts.hbs',
      },
      {
        type: 'add',
        path: 'src/libs/{{dashCase name}}/configurations/{{dashCase name}}.configuration.ts',
        templateFile: 'plop-templates/module/configuration.ts.hbs',
      },
      {
        type: 'add',
        path: 'src/libs/{{dashCase name}}/configurations/api.configuration.ts',
        templateFile: 'plop-templates/module/api.configuration.ts.hbs',
      },
      {
        type: 'add',
        path: 'src/libs/{{dashCase name}}/configurations/index.ts',
        templateFile: 'plop-templates/module/index-configurations.ts.hbs',
      },
      {
        type: 'add',
        path: 'src/libs/{{dashCase name}}/guards/{{dashCase name}}.guard.ts',
        templateFile: 'plop-templates/module/guard.ts.hbs',
      },
      {
        type: 'add',
        path: 'src/libs/{{dashCase name}}/guards/index.ts',
        templateFile: 'plop-templates/module/index-guards.ts.hbs',
      },
      {
        type: 'add',
        path: 'src/libs/{{dashCase name}}/index.ts',
        templateFile: 'plop-templates/module/index.ts.hbs',
      },
      {
        type: 'add',
        path: 'src/app/configurations/{{dashCase name}}.configuration.ts',
        templateFile: 'plop-templates/module/portal-configuration.ts.hbs',
      },
      {
        type: 'add',
        path: 'src/libs/{{dashCase name}}/services/base/base.model.ts',
        templateFile: 'plop-templates/module/base.model.ts.hbs',
      },
      {
        type: 'add',
        path: 'src/libs/{{dashCase name}}/services/base/base.service.ts',
        templateFile: 'plop-templates/module/base.service.ts.hbs',
      },
      // TẠO FILE INDEX CHO SERVICES ĐỂ EXPORT BASE (Barrel Pattern)
      {
        type: 'add',
        path: 'src/libs/{{dashCase name}}/services/index.ts',
        template: "export * from './base/base.model';\nexport * from './base/base.service';\n",
      },
      // --- 3. Custom Action: Cập nhật tsconfig.json ---
      function updateTsConfig(answers) {
        const dashName = plop.getHelper('dashCase')(answers.name);
        const tsConfigPath = path.resolve('tsconfig.json');

        if (fs.existsSync(tsConfigPath)) {
          const tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, 'utf8'));

          // Khởi tạo nếu chưa có
          if (!tsConfig.compilerOptions) tsConfig.compilerOptions = {};
          if (!tsConfig.compilerOptions.paths) tsConfig.compilerOptions.paths = {};

          // Bổ sung paths
          tsConfig.compilerOptions.paths[`@${dashName}`] = [`./src/libs/${dashName}`];
          tsConfig.compilerOptions.paths[`@${dashName}/*`] = [`./src/libs/${dashName}/*`];

          // Ghi đè lại file
          fs.writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 2));
          return `Đã cập nhật paths trong tsconfig.json cho @${dashName}`;
        }
        return 'Không tìm thấy file tsconfig.json để cập nhật';
      },

      // --- 4. Custom Action: In ra màn hình hướng dẫn Routing ---
      function printInstructions(answers) {
        const dashName = plop.getHelper('dashCase')(answers.name);
        const camelName = plop.getHelper('camelCase')(answers.name);
        const properName = plop.getHelper('properCase')(answers.name);
        const constantName = plop.getHelper('constantCase')(answers.name);

        console.log(`\n======================================================================`);
        console.log(`🚀 TẠO MODULE [${dashName}] THÀNH CÔNG!`);
        console.log(`======================================================================\n`);
        console.log(`👉 Vui lòng copy đoạn code sau và dán vào file cấu hình Routes của Portal:\n`);

        console.log(`          {`);
        console.log(`            path: '${dashName}',`);
        console.log(`            loadChildren: () => import('@${dashName}').then(m => m.${camelName}Routes),`);
        console.log(`            providers: [`);
        console.log(`              { provide: ${constantName}_CONFIGURATION, useClass: ${properName}Configuration }`);
        console.log(`            ]`);
        console.log(`          },`);

        console.log(`\n======================================================================\n`);
        return 'Hoàn thành!';
      },
    ],
  });

  // ============================================================
  // 2. GENERATOR: TẠO ENTITY (CRUD Pages, Service, Model)
  // ============================================================
  plop.setGenerator('entity', {
    description: 'Tạo CRUD Entity bên trong một Module (List, Detail, Service...)',
    prompts: [
      {
        type: 'list',
        name: 'lib',
        message: 'Chọn module (lib):',
        choices: libChoices,
      },
      {
        type: 'input',
        name: 'name',
        message: 'Nhập tên entity (vd: product, purchase-order):',
      },
      {
        type: 'input',
        name: 'label',
        message: 'Nhập nhãn hiển thị (vd: sản phẩm, đơn hàng):',
      },
      {
        type: 'list',
        name: 'detailType',
        message: 'Chọn kiểu hiển thị trang chi tiết:',
        choices: [
          { name: 'Thông thường (trang riêng)', value: 'page' },
          { name: 'Side Drawer (hiển thị bên cạnh list)', value: 'side-drawer' },
        ],
        default: 'page',
      },
      {
        type: 'list',
        name: 'importExcel',
        message: 'Có import Excel không?',
        choices: [
          { name: 'Không', value: 'no' },
          { name: 'Có', value: 'yes' },
        ],
        default: 'no',
      },
    ],
    actions: function (data) {
      const baseName = '{{kebabCase name}}';
      const libBase = `src/libs/${data.lib}`;
      const modulePath = `${libBase}/modules/${baseName}`;
      const templateDir = `plop-templates/entity/${data.detailType}`;

      const actions = [
        // --- Service & Model (nằm trong thư mục services của entity) ---
        {
          type: 'add',
          path: `${modulePath}/services/${baseName}.service.ts`,
          templateFile: 'plop-templates/entity/service.ts.hbs',
        },
        {
          type: 'add',
          path: `${modulePath}/services/${baseName}.model.ts`,
          templateFile: 'plop-templates/entity/model.ts.hbs',
        },
        // --- Routes (standalone routes, không có NgModule) ---
        {
          type: 'add',
          path: `${modulePath}/${baseName}.routes.ts`,
          templateFile: 'plop-templates/entity/routes.ts.hbs',
        },
        {
          type: 'add',
          path: `${modulePath}/index.ts`,
          templateFile: 'plop-templates/entity/index.ts.hbs',
        },
        // --- UI Pages (list + detail theo detailType) ---
        {
          type: 'add',
          path: `${modulePath}/pages/list/list.component.ts`,
          templateFile: `${templateDir}/list.component.ts.hbs`,
        },
        {
          type: 'add',
          path: `${modulePath}/pages/detail/detail.component.ts`,
          templateFile: `${templateDir}/detail.component.ts.hbs`,
        },
      ];

      // --- Import Excel (tuỳ chọn) ---
      if (data.importExcel === 'yes') {
        actions.push(
          {
            type: 'add',
            path: `${modulePath}/components/import-${baseName}/import-${baseName}.component.ts`,
            templateFile: 'plop-templates/entity/page/import-excel.component.ts.hbs',
          }
        );
      }

      actions.push(function updateModuleRoutesAndMenu(answers) {
        const appendToArrayLiteral = (content, arrayOpenIndex, itemLiteral) => {
          if (arrayOpenIndex < 0) return content;
          let depth = 0;
          let closeIndex = -1;
          for (let i = arrayOpenIndex; i < content.length; i++) {
            const ch = content[i];
            if (ch === '[') depth++;
            if (ch === ']') {
              depth--;
              if (depth === 0) {
                closeIndex = i;
                break;
              }
            }
          }
          if (closeIndex < 0) return content;

          const before = content.slice(0, closeIndex);
          const inside = content.slice(arrayOpenIndex + 1, closeIndex);
          const insideNoComments = inside
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/\/\/.*$/gm, '')
            .trim();
          const hasItem = insideNoComments.length > 0;
          const prefix = hasItem ? (inside.trimEnd().endsWith(',') ? '' : ',') : '';
          return `${before}${prefix}\n${itemLiteral}\n${content.slice(closeIndex)}`;
        };

        const libName = plop.getHelper('dashCase')(answers.lib);
        const entityKebab = plop.getHelper('kebabCase')(answers.name);
        const entityCamel = plop.getHelper('camelCase')(answers.name);
        const entityLabel = answers.label;

        const routesPath = path.resolve(`src/libs/${libName}/routes.ts`);
        if (fs.existsSync(routesPath)) {
          let routesContent = fs.readFileSync(routesPath, 'utf8');
          const routeMatcher = `path: '${entityKebab}'`;
          const routeSnippet = `      {\n        path: '${entityKebab}',\n        loadChildren: () =>\n          import('@${libName}/modules/${entityKebab}').then((m) => m.${entityCamel}Routes),\n      },`;

          if (!routesContent.includes(routeMatcher)) {
            const childrenIndex = routesContent.indexOf('children: [');
            const childrenOpenBracket = childrenIndex >= 0 ? routesContent.indexOf('[', childrenIndex) : -1;
            if (childrenOpenBracket >= 0) {
              routesContent = appendToArrayLiteral(routesContent, childrenOpenBracket, routeSnippet);
              fs.writeFileSync(routesPath, routesContent.replace(/\r\n/g, '\n'));
            }
          }
        }

        const mainMenuPath = path.resolve('src/app/components/main/main.component.ts');
        if (fs.existsSync(mainMenuPath)) {
          let mainContent = fs.readFileSync(mainMenuPath, 'utf8');
          const entityPath = `path: '/${libName}/${entityKebab}'`;

          if (!mainContent.includes(entityPath)) {
            const moduleTitle = libName.toUpperCase();
            const moduleTitleMatcher = `title: '${moduleTitle}'`;

            if (mainContent.includes(moduleTitleMatcher)) {
              const moduleTitleIndex = mainContent.indexOf(moduleTitleMatcher);
              const moduleChildrenIndex = mainContent.indexOf('children: [', moduleTitleIndex);
              const moduleChildrenOpenBracket = moduleChildrenIndex >= 0 ? mainContent.indexOf('[', moduleChildrenIndex) : -1;

              if (moduleChildrenOpenBracket >= 0) {
                const menuChild = `        { path: '/${libName}/${entityKebab}', title: '${entityLabel}' },`;
                mainContent = appendToArrayLiteral(mainContent, moduleChildrenOpenBracket, menuChild);
              }
            } else {
              const moduleMenu = `\n    {\n      icon: 'groups',\n      title: '${moduleTitle}',\n      children: [{ path: '/${libName}/${entityKebab}', title: '${entityLabel}' }],\n    },`;
              const menusCloseIndex = mainContent.lastIndexOf('  ];');
              if (menusCloseIndex >= 0) {
                mainContent = mainContent.slice(0, menusCloseIndex) + moduleMenu + '\n' + mainContent.slice(menusCloseIndex);
              }
            }

            fs.writeFileSync(mainMenuPath, mainContent.replace(/\r\n/g, '\n'));
          }
        }

        return `Đã cập nhật route và menu cho entity ${entityKebab}`;
      });

      return actions;
    },
  });
};
