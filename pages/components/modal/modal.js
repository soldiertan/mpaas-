Component({
  methods: {
    onItemTap() {
      const { onItemTap } = this.props;
      if(onItemTap) {
        onItemTap();
      }
    },
    onItemClick(e) {
      const { onItemClick } = this.props;
      const { value } = e.target.dataset;
      if(onItemClick) {
        onItemClick(value);
      }
    },
    onItemClose() {
      const { onItemClose } = this.props;
      if(onItemClose) {
        onItemClose();
      }
    }
  }
})