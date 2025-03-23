import { ref } from 'vue'

type Language = 'en' | 'zh'

export const currentLang = ref<Language>('en')

type Messages = {
  [key in Language]: {
    toolbar: {
      reset: string
      format: string
      convert: string
      lightMode: string
      darkMode: string
      interfaceName: string
      indent: string
    }
    editor: {
      jsonInput: string
      typeScriptOutput: string
      placeholder: string
      typeScriptPlaceholder: string
      error: {
        emptyInput: string
        invalidJson: string
        conversionFailed: string
      }
    }
  }
}

export const messages: Messages = {
  en: {
    toolbar: {
      reset: 'Reset',
      format: 'Format',
      convert: 'Convert',
      lightMode: 'Light Mode',
      darkMode: 'Dark Mode',
      interfaceName: 'Interface Name',
      indent: 'Indent',
    },
    editor: {
      jsonInput: 'JSON Input',
      typeScriptOutput: 'TypeScript Output',
      placeholder: 'Paste your JSON data here...',
      typeScriptPlaceholder: 'Generated TypeScript types will appear here...',
      error: {
        emptyInput: 'Please input JSON data first',
        invalidJson: 'Invalid JSON format',
        conversionFailed: 'Conversion failed, please check JSON format',
      },
    },
  },
  zh: {
    toolbar: {
      reset: '重置',
      format: '格式化',
      convert: '转换',
      lightMode: '浅色模式',
      darkMode: '暗色模式',
      interfaceName: '接口名称',
      indent: '缩进',
    },
    editor: {
      jsonInput: 'JSON 输入',
      typeScriptOutput: 'TypeScript 输出',
      placeholder: '在此处粘贴你的JSON数据...',
      typeScriptPlaceholder: '生成的TypeScript类型将在这里显示...',
      error: {
        emptyInput: '请先输入JSON数据',
        invalidJson: '无效的JSON格式',
        conversionFailed: '转换失败，请检查JSON格式',
      },
    },
  },
}

export function setLanguage(lang: Language) {
  currentLang.value = lang
}

export function t(key: string) {
  const keys = key.split('.')
  let value: any = messages[currentLang.value]

  for (const k of keys) {
    value = value[k]
    if (!value)
      return key
  }

  return value
}
