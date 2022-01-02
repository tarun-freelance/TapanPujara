<template>
  <EmployeeItem :show-info="showInfo" />
  <DxPopup v-model:visible="popupVisible" title="Employee">
    <DxForm :form-data="currentEmployee">
      <DxGroupItem :col-count="2" css-class="second-group">
        <DxGroupItem>
          <DxSimpleItem data-field="Name" />
          <DxSimpleItem data-field="DOB" editor-type="dxDateBox" />
        </DxGroupItem>
        <DxGroupItem>
          <DxSimpleItem data-field="City" />
          <DxSimpleItem data-field="Gender" />
        </DxGroupItem>
        <DxGroupItem>
          <DxLabel text="State"/>
          <DxSelectBox
            :data-source="states1"
            :search-enabled="true"
            display-expr="StateName"
            value-expr="Id"
            v-model:value="currentEmployee.StateId"
            editor-type="dxSelectBox"
          />
        </DxGroupItem>
      </DxGroupItem>
    </DxForm>
    <DxToolbarItem
      widget="dxButton"
      toolbar="bottom"
      location="after"
      :options="emailButtonOptions"
    />
    <DxToolbarItem
      widget="dxButton"
      toolbar="bottom"
      location="after"
      :options="closeButtonOptions"
    />
  </DxPopup>
</template>
<script>
import { DxSelectBox } from "devextreme-vue/select-box";
import { DxPopup, DxToolbarItem } from "devextreme-vue/popup";
import notify from "devextreme/ui/notify";
import EmployeeItem from "./newpopup1.vue";
import { DxForm, DxSimpleItem, DxGroupItem,DxLabel } from "devextreme-vue/form";
export default {
  components: {
    DxPopup,
    EmployeeItem,
    DxToolbarItem,
    DxForm,
    DxSimpleItem,
    DxGroupItem,
    DxSelectBox,
    DxLabel
  },

  data() {
    return {
      states1: [],
      currentEmployee: {},
      popupVisible: false,
      positionOf: "",
      emailButtonOptions: {
        icon: "email",
        text: "Send",
        onClick: () => {
          const message = `Email is sent to ${this.currentEmployee.FirstName} ${this.currentEmployee.LastName}`;
          notify(
            {
              message,
              position: {
                my: "center top",
                at: "center top",
              },
            },
            "success",
            3000
          );
        },
      },
      closeButtonOptions: {
        text: "Close",
        onClick: () => {
          this.popupVisible = false;
        },
      },
    };
  },

  methods: {
    showInfo(employee, states) {
      this.currentEmployee = employee;
      this.states1 = states;
      this.popupVisible = true;
      console.log(this.currentEmployee);
    },
  },
};
</script>
