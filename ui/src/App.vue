<template>
  <div>
    <form>
      <label>Start url:</label>
      <input v-model="startUrl" type="text">
      <label>Max depth:</label>
      <input v-model="maxDepth" type="number">
      <label>Max total pages:</label>
      <input v-model="maxTotalPages" type="number">
      <button type="button" @click="run">Run</button>
    </form>
    <div id="error" v-if="error">{{ message }}</div>
    <div v-if="success">{{ message }}</div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      message: null,
      error: false,
      startUrl: null,
      maxDepth: null,
      maxTotalPages: null,
      fetchingResult: false,
      success: false
    }
  },
  methods: {
    async run() {
      if (this.fetchingResult) {
        this.error = true;
        this.message = 'Waiting for response from last requst';
        return;
      }
      this.fetchingResult = true;
      const result = await fetch('http://localhost:3001/crawl',{
        method: 'post',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({startUrl: this.startUrl, maxDepth: this.maxDepth, maxTotalPages: this.maxTotalPages})
      }).then(res => {
        if (res.status !== 202) {
          this.error = true;
        }
        return res.json();
      });
      if (this.error) {
        this.message = result.error;
      } else {
        this.fetchResult(result.id);
      }
    },
    fetchResult(id) {
      const intervalRequest = setInterval(async () => {
        const result = await fetch(`http://localhost:3001/crawl?id=${id}`).then(res => res.json());
        if (result) {
          clearInterval(intervalRequest);
          this.fetchingResult = false;
          this.clearForm();
          this.message = JSON.stringify(result);
          this.success = true;
        }
      }, 5000);  
  
    },
    clearForm() {
      this.message = null;
      this.error = false;
      this.maxTotalPages = null;
      this.maxDepth = null;
      this.startUrl = null;
    }
  }
}
</script>
