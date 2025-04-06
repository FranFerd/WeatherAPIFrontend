<template>
  <div class="address-autocomplete">
    <input
      v-model="searchQuery"
      @input="onInput"
      @focus="showDropdown = true"
      @blur="setTimeout(() => showDropdown = false, 200)"
      placeholder="Enter city or country"
    />
    <ul v-if="showDropdown && suggestions.length" class="suggestions-dropdown">
      <li
        v-for="(suggestion, index) in suggestions"
        :key="index"
        @mousedown.prevent="selectSuggestion(suggestion)"
      >
        {{ suggestion.address }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import _ from 'lodash'
import { debounce } from 'lodash'

const searchQuery = ref('')
const suggestions = ref([])
const isLoading = ref(false)
const showDropdown = ref(false)
const error = ref(null)

const fetchSuggestions = debounce(async (query) => {
  if (!query.trim()) {
    suggestions.value = []
    return
  }

  isLoading.value = true
  error.value = null

  try {
    const response = await axios.get('http://localhost:5000/api/autocomplete', {
      params: { query },
      timeout: 5000
    })
    if(response.data?.error){
      error.value = response.data.error
      suggestions.value = []
    }
    else{
      suggestions.value = response.data || []
    }
  } catch (err) {
    error.value = err.response?.data?.error || err.message
    suggestions.value = []
  }
    finally{
      isLoading.value = false
    }
}, 300)

const onInput = () => fetchSuggestions(searchQuery.value)

const selectSuggestion = (suggestion) => {
  searchQuery.value = suggestion.address
  suggestions.value = []
  // Emit to parent if needed: emit('select', suggestion)
}
</script>

<style scoped>
.address-autocomplete {
  position: relative;
  width: 300px;
}

.suggestions-dropdown {
  position: absolute;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  z-index: 1000;
  list-style: none;
  padding: 0;
  margin: 0;
}

.suggestions-dropdown li {
  padding: 8px 12px;
  cursor: pointer;
}

.suggestions-dropdown li:hover {
  background-color: #f5f5f5;
}
</style>