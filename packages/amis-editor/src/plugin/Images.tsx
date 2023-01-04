import {registerEditorPlugin} from 'amis-editor-core';
import {BaseEventContext, BasePlugin} from 'amis-editor-core';
import {defaultValue, getSchemaTpl, tipedLabel} from 'amis-editor-core';
import {mockValue} from 'amis-editor-core';

export class ImagesPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'images';
  $schema = '/schemas/ImagesSchema.json';

  // 组件名称
  name = '图片集';
  isBaseComponent = true;
  description = '展示多张图片';
  tags = ['展示'];
  icon = 'fa fa-clone';
  pluginIcon = 'images-plugin';
  scaffold = {
    type: 'images'
  };
  previewSchema = {
    ...this.scaffold,
    listClassName: 'nowrap',
    thumbMode: 'cover',
    value: [
      {
        title: '图片1',
        image: mockValue({type: 'image'}),
        src: mockValue({type: 'image'})
      },
      {
        title: '图片2',
        image: mockValue({type: 'image'}),
        src: mockValue({type: 'image'})
      }
    ]
  };

  panelTitle = '图片集';
  panelJustify = true;
  panelBodyCreator = (context: BaseEventContext) => {
    const isUnderField = /\/field\/\w+$/.test(context.path as string);
    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: (isUnderField ? [] : [
              {
                type: 'formula',
                name: '__mode',
                autoSet: false,
                formula:
                  '!this.name && !this.source && Array.isArray(this.options) ? 2 : 1'
              },
              {
                label: '数据源',
                name: '__mode',
                type: 'button-group-select',
                size: 'sm',
                options: [
                  {
                    label: '关联字段',
                    value: 1
                  },
                  {
                    label: '静态设置',
                    value: 2
                  }
                ],
                onChange: (
                  value: any,
                  oldValue: any,
                  model: any,
                  form: any
                ) => {
                  if (value !== oldValue && value == 1) {
                    form.deleteValueByName('options');
                  }
                }
              },
              {
                name: 'source',
                type: 'input-text',
                label: '关联数据',
                description:
                  '比如：\\${listVar}，用来关联作用域中的已有数据。',
                visibleOn: 'this.__mode == 1'
              },
              {
                type: 'combo',
                name: 'options',
                visibleOn: 'this.__mode == 2',
                minLength: 1,
                label: '图片集数据',
                multiple: true,
                multiLine: true,
                addable: true,
                removable: true,
                value: [{}],
                items: [
                  getSchemaTpl('imageUrl', {
                    name: 'image',
                    label: '缩略图'
                  }),
                  getSchemaTpl('imageUrl', {
                    name: 'src',
                    label: '原图'
                  }),
                  {
                    type: 'input-text',
                    label: '图片标题',
                    name: 'title'
                  },
                  {
                    type: 'textarea',
                    label: '图片描述',
                    name: 'caption'
                  }
                ]
              },
              getSchemaTpl('switch', {
                name: 'enlargeAble',
                label: '图片放大功能'
              })
            ]).concat([
              getSchemaTpl('imageUrl', {
                name: 'defaultImage',
                label: tipedLabel('占位图', '无数据时显示的图片')
              })
            ])
          },
          getSchemaTpl('status')
        ])
      },
      {
        title: '外观',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              // 已废弃
              // getSchemaTpl('switch', {
              //   name: 'showDimensions',
              //   label: '显示图片尺寸'
              // }),

              {
                name: 'thumbMode',
                type: 'select',
                label: '缩略图展示模式',
                mode: 'horizontal',
                labelAlign: 'left',
                horizontal: {
                  left: 5,
                  right: 7
                },
                pipeIn: defaultValue('contain'),
                options: [
                  {
                    label: '宽度占满',
                    value: 'w-full'
                  },

                  {
                    label: '高度占满',
                    value: 'h-full'
                  },

                  {
                    label: '包含',
                    value: 'contain'
                  },

                  {
                    label: '铺满',
                    value: 'cover'
                  }
                ]
              },

              {
                name: 'thumbRatio',
                type: 'button-group-select',
                label: '缩略图比率',
                size: 'sm',
                pipeIn: defaultValue('1:1'),
                options: [
                  {
                    label: '1:1',
                    value: '1:1'
                  },

                  {
                    label: '4:3',
                    value: '4:3'
                  },

                  {
                    label: '16:9',
                    value: '16:9'
                  }
                ]
              }
            ]
          },
          {
            title: 'CSS类名',
            body: [
              getSchemaTpl('className', {
                autoComplete: false,
                label: '外层'
              }),

              getSchemaTpl('className', {
                name: 'listClassName',
                label: '图片列表'
              })
            ]
          }
        ])
      }
    ]);
  };
}

registerEditorPlugin(ImagesPlugin);
