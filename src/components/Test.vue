<template>
  <div class="typewriter-container">
    <h1 ref="typewriterElement" class="welcome-message"></h1>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  lines: {
    type: Array,
    default: () => ["Welcome to Weather API service"]
  },
  speed: {
    type: Number,
    default: 100
  },
  lineDelay: {
    type: Number,
    default: 50 // delay between lines
  }
})

const typewriterElement = ref(null)
let typingTimeout = null

onMounted(() => {
  typeLines()
})

function typeLines() {
  let currentLine = 0
  
  function typeNextLine() {
    if (currentLine < props.lines.length) {
      typeText(props.lines[currentLine], () => {
        currentLine++
        if (currentLine < props.lines.length) {
          typewriterElement.value.innerHTML += '<br>'
          typingTimeout = setTimeout(typeNextLine, props.lineDelay)
        }
      })
    }
  }
  
  typeNextLine()
}

function typeText(text, onComplete) {
  let i = 0
  const target = typewriterElement.value
  
  function type() {
    if (i < text.length) {
      target.innerHTML += text.charAt(i)
      i++
      typingTimeout = setTimeout(type, props.speed)
    } else if (onComplete) {
      onComplete()
    }
  }
  
  type()
}

onUnmounted(() => {
  if (typingTimeout) clearTimeout(typingTimeout)
})
</script>

<style scoped>
.typewriter-container {
  margin: 2rem 0;
}

.welcome-message {
  font-family: Brush Script MT;
  font-size: 100px;
  /* border-right: 3px solid; */
  white-space: nowrap;
  overflow: hidden;
  animation: blink-caret 0.75s step-end infinite;
}

@keyframes blink-caret {
  from, to { border-color: transparent }
  50% { border-color: #7cdfdb; } /* Match your theme color */
}
</style>