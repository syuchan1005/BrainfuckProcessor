<template>
  <div id="app">
    <md-app md-waterfall md-mode="fixed">
      <md-app-toolbar class="md-primary">
        <span class="md-title">Brainfuck Processor</span>
      </md-app-toolbar>

      <md-app-content>
        <router-view></router-view>
      </md-app-content>
    </md-app>

    <md-tabs md-alignment="centered" md-sync-route>
      <md-tab id="tab-encode" md-label="Encode" md-icon="file_download" to="/encode"/>
      <md-tab id="tab-decode" md-label="Decode" md-icon="file_upload" to="/decode"/>
      <md-tab id="tab-setting" md-label="Setting" md-icon="settings_input_component" to="/setting"/>
    </md-tabs>
  </div>
</template>

<script>
export default {
  name: 'app',
};
</script>

<style>
  html, body, #app {
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
  }

  .md-app {
    height: calc(100% - 72px);
  }
</style>
