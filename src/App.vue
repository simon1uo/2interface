<script setup lang="ts">
import {
  ArrowPathIcon,
  CodeBracketIcon,
  DocumentTextIcon,
  LanguageIcon,
  MoonIcon,
  SunIcon,
} from '@heroicons/vue/24/outline'
import { useDark, usePreferredDark } from '@vueuse/core'
import * as monaco from 'monaco-editor'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { currentLang, setLanguage, t } from './i18n'

const jsonInput = ref('')
const typeScriptOutput = ref('')
const error = ref('')
const interfaceName = ref('RootObject')
const indentSize = ref(2)
let jsonEditor: monaco.editor.IStandaloneCodeEditor | null = null
let outputEditor: monaco.editor.IStandaloneCodeEditor | null = null

// 使用 VueUse 的暗色模式工具
const isDark = useDark()
const _preferredDark = usePreferredDark()

// 示例数据
const exampleJson = {
  name: '张三',
  age: 25,
  isStudent: false,
  hobbies: ['读书', '游泳', '编程'],
  address: {
    city: '北京',
    street: '朝阳区',
    zipCode: '100020',
  },
  contact: {
    email: 'zhangsan@example.com',
    phone: '13800138000',
  },
  scores: [
    { subject: '数学', score: 95 },
    { subject: '语文', score: 88 },
  ],
}

// 初始化示例数据
onMounted(() => {
  if (!jsonInput.value) {
    jsonInput.value = JSON.stringify(exampleJson, null, 2)
  }

  // 初始化 JSON 编辑器
  jsonEditor = monaco.editor.create(document.getElementById('json-editor')!, {
    value: jsonInput.value,
    language: 'json',
    theme: isDark.value ? 'vs-dark' : 'vs',
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    fontSize: 14,
    lineNumbers: 'on',
    roundedSelection: false,
    readOnly: false,
    cursorStyle: 'line',
    formatOnPaste: true,
    formatOnType: true,
    quickSuggestions: { other: true, comments: true, strings: true },
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnEnter: 'on',
    tabCompletion: 'on',
    wordBasedSuggestions: 'currentDocument',
  })

  // 初始化输出编辑器
  outputEditor = monaco.editor.create(document.getElementById('output-editor')!, {
    value: typeScriptOutput.value,
    language: 'typescript',
    theme: isDark.value ? 'vs-dark' : 'vs',
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    fontSize: 14,
    lineNumbers: 'on',
    roundedSelection: false,
    readOnly: true,
    cursorStyle: 'line',
    quickSuggestions: { other: true, comments: true, strings: true },
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnEnter: 'on',
    tabCompletion: 'on',
    wordBasedSuggestions: 'currentDocument',
  })

  // 监听编辑器内容变化
  jsonEditor.onDidChangeModelContent(() => {
    jsonInput.value = jsonEditor!.getValue()
  })

  // 监听暗色模式变化
  watch(isDark, (newValue) => {
    monaco.editor.setTheme(newValue ? 'vs-dark' : 'vs')
  })
})

// 清理编辑器实例
onBeforeUnmount(() => {
  if (jsonEditor) {
    jsonEditor.dispose()
  }
  if (outputEditor) {
    outputEditor.dispose()
  }
})

// 更新输出内容
watch(typeScriptOutput, (newValue) => {
  if (outputEditor) {
    outputEditor.setValue(newValue)
  }
})

// 重置所有内容
function resetAll() {
  jsonInput.value = ''
  typeScriptOutput.value = ''
  error.value = ''
  interfaceName.value = 'RootObject'
}

// 格式化JSON
function formatJson() {
  if (!jsonInput.value.trim()) {
    error.value = t('editor.error.emptyInput')
    return
  }

  try {
    const parsed = JSON.parse(jsonInput.value)
    jsonInput.value = JSON.stringify(parsed, null, 2)
    error.value = ''
  }
  catch (e: any) {
    error.value = t('editor.error.invalidJson')
  }
}

// 将JSON转换为TypeScript接口
function convertToTypeScript() {
  if (!jsonInput.value.trim()) {
    error.value = t('editor.error.emptyInput')
    return
  }

  try {
    const jsonData = JSON.parse(jsonInput.value)
    const result = generateTypeScriptInterface(jsonData, interfaceName.value)
    typeScriptOutput.value = result
    error.value = ''
  }
  catch (e) {
    error.value = t('editor.error.conversionFailed')
    console.error(e)
  }
}

// 判断值的类型
function getType(value: any): string {
  if (value === null)
    return 'null'
  if (Array.isArray(value)) {
    const itemTypes = value.map(item => getType(item))
    const uniqueTypes = [...new Set(itemTypes)]

    if (uniqueTypes.length === 0)
      return 'any[]'
    if (uniqueTypes.length === 1)
      return `${uniqueTypes[0]}[]`
    return `(${uniqueTypes.join(' | ')})[]`
  }

  const type = typeof value
  if (type === 'object') {
    return 'object'
  }

  return type
}

// 递归生成TypeScript接口
function generateTypeScriptInterface(obj: any, interfaceName: string, depth = 0): string {
  let result = ''
  const indentation = ' '.repeat(indentSize.value * depth)

  if (typeof obj !== 'object' || obj === null) {
    return `type ${interfaceName} = ${typeof obj};`
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      return `type ${interfaceName} = any[];`
    }

    // 采样数组中的第一个元素
    const sampleItem = obj[0]
    if (typeof sampleItem === 'object' && sampleItem !== null) {
      const itemTypeName = `${interfaceName}Item`
      const itemType = generateTypeScriptInterface(sampleItem, itemTypeName, depth)
      return `${itemType}\n\ntype ${interfaceName} = ${itemTypeName}[];`
    }
    else {
      const itemType = getType(sampleItem)
      return `type ${interfaceName} = ${itemType}[];`
    }
  }

  // 收集所有嵌套接口
  const nestedInterfaces: string[] = []
  result += `interface ${interfaceName} {\n`

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key]
      const propName = /^[a-z_$][\w$]*$/i.test(key) ? key : `'${key}'`

      result += `${indentation}  ${propName}: `

      if (value === null) {
        result += 'null'
      }
      else if (Array.isArray(value)) {
        if (value.length === 0) {
          result += 'any[]'
        }
        else {
          const firstItem = value[0]
          if (typeof firstItem === 'object' && firstItem !== null) {
            const nestedName = `${interfaceName}${capitalizeFirstLetter(key)}`
            result += `${nestedName}[]`
            nestedInterfaces.push(generateTypeScriptInterface(firstItem, nestedName, depth + 1))
          }
          else {
            result += `${getType(firstItem)}[]`
          }
        }
      }
      else if (typeof value === 'object') {
        const nestedName = `${interfaceName}${capitalizeFirstLetter(key)}`
        result += nestedName
        nestedInterfaces.push(generateTypeScriptInterface(value, nestedName, depth + 1))
      }
      else {
        result += typeof value
      }

      result += ';\n'
    }
  }

  result += `${indentation}}`

  // 如果有嵌套接口，将它们添加到结果中
  if (nestedInterfaces.length > 0) {
    result += `\n\n${nestedInterfaces.join('\n\n')}`
  }

  return result
}

// 首字母大写
function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
</script>

<template>
  <div class="h-screen flex flex-col bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
    <!-- Toolbar -->
    <div class="bg-white dark:bg-gray-800 shadow p-2 sm:p-3 flex flex-wrap items-center gap-2 sm:gap-4 box-shadow">
      <button
        class="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded font-medium flex items-center gap-1 text-gray-800 dark:text-gray-200"
        @click="resetAll"
      >
        <ArrowPathIcon class="w-4 h-4 sm:w-5 sm:h-5" />
        <span class="sm:hidden">{{ t('toolbar.reset') }}</span>
      </button>
      <div class="flex items-center gap-2">
        <input
          v-model="interfaceName" type="text" :placeholder="t('toolbar.interfaceName')"
          class="px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
        <select
          v-model="indentSize"
          class="px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          :placeholder="t('toolbar.indent')" :title="t('toolbar.indent')"
        >
          <option :value="2">
            2
          </option>
          <option :value="4">
            4
          </option>
        </select>
      </div>
      <button
        class="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-indigo-100 dark:bg-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-800 text-indigo-700 dark:text-indigo-300 rounded font-medium flex items-center gap-1"
        @click="formatJson"
      >
        <DocumentTextIcon class="w-4 h-4 sm:w-5 sm:h-5" />
        <span class="sm:hidden">{{ t('toolbar.format') }}</span>
      </button>
      <button
        class="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-blue-600 hover:bg-blue-700 text-white rounded font-medium flex items-center gap-1"
        @click="convertToTypeScript"
      >
        <CodeBracketIcon class="w-4 h-4 sm:w-5 sm:h-5" />
        <span class="sm:hidden"> {{ t('toolbar.convert') }}</span>
      </button>
      <div v-if="error" class="text-sm sm:text-base text-red-500 dark:text-red-400 ml-2 sm:ml-4">
        {{ error }}
      </div>
      <div class="flex items-center gap-2 ml-auto">
        <button
          class="ml-auto px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded font-medium flex items-center gap-1 text-gray-800 dark:text-gray-200"
          @click="setLanguage(currentLang === 'en' ? 'zh' : 'en')"
        >
          <!-- <span class="i-carbon-language text-lg" /> -->
          <LanguageIcon class="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button
          class="ml-auto px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded font-medium flex items-center gap-1 text-gray-800 dark:text-gray-200"
          @click="isDark = !isDark"
        >
          <SunIcon v-if="isDark" class="w-4 h-4 sm:w-5 sm:h-5" />
          <MoonIcon v-else class="w-4 h-4 sm:w-5 sm:h-5" />
          <!-- <span>{{ isDark ? t('toolbar.lightMode') : t('toolbar.darkMode') }}</span> -->
        </button>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col lg:flex-row overflow-auto">
      <!-- Input Panel -->
      <div class="w-full lg:w-1/2 flex flex-col p-2 sm:p-4">
        <div class="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ t('editor.jsonInput') }}
        </div>
        <div
          id="json-editor"
          class="flex-1 min-h-lg border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden"
        />
      </div>

      <!-- Output Panel -->
      <div class="w-full lg:w-1/2 flex flex-col p-2 sm:p-4">
        <div class="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ t('editor.typeScriptOutput') }}
        </div>
        <div id="output-editor" class="flex-1 min-h-lg border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden" />
      </div>
    </div>
  </div>
</template>
