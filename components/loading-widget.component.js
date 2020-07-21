angular.module("forecastApp").component('loadingWidget', {
    templateUrl: 'components/loading-widget.component.html',
    bindings: {
        showtext : '<'
    },
    controller: function LoadingController() {
        this.text = '';
        this.$onInit = () => {
            this.text = this.showtext ? 'Loading' : ''; 
        }
    }
})

