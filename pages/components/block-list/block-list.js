Component({
  methods: {
    onItemTap(e) {
      const { onItemTap } = this.props;
      const { value, disabled } = e.target.dataset;
      if(onItemTap) {
        onItemTap(value, disabled);
      }
    },
    onItemInput(e) {
      const { onItemInput } = this.props;
      const input = e.detail.value;
      if(onItemInput) {
        onItemInput(input)
      }
    },
    onItemBlur(e) {
      const { onItemBlur } = this.props;
      const input = e.detail.value;
      if(onItemBlur) {
        onItemBlur(input);
      }
    },
    onListTap(e) {
      const { onListTap } = this.props;
      const { value } = e.target.dataset;
      if(onListTap) {
        onListTap(value)
      }
    }
  }
})