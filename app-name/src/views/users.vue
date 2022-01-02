<template>
  <div id="data-grid-demo">
    <DxDataGrid
      :data-source="userList"
      :show-borders="true"
      key-expr="Id"
      @row-updating="updateRow"
      @row-inserting="addRow"
      @editing-start="logEvent"
      @editing-end="endEdit"
    >
      <DxPaging :enabled="false" />
      <DxEditing
        :allow-updating="true"
        :allow-adding="true"
        :allow-deleting="true"
        mode="popup"
      >
        <DxPopup
          :show-title="true"
          :width="700"
          :height="525"
          title="Employee Information"
        />
        <DxForm>
          <DxItem :col-count="2" :col-span="2" item-type="group">
            <DxItem data-field="Name" />
            <DxItem data-field="City" />
            <DxItem data-field="DOB" />
            <DxItem data-field="Gender">
              <template #default>
                <DxRadioGroup
                  :items="genderValues"
                  value-expr="id"
                  display-expr="text"
                  v-model="selectedGender"
                  layout="horizontal"
                  @value-changed="radioChanged"
                />
              </template>
            </DxItem>
            <DxItem data-field="IsActivated" editor-type="dxCheckBox" />
            <DxItem data-field="StateId" />
          </DxItem>
          
        </DxForm>
      </DxEditing>

      <DxColumn data-field="Name" caption="Title" />
      <DxColumn data-field="City" />
      <DxColumn data-field="DOB" data-type="date" />
      <DxColumn :visible="true" data-field="Gender" />
      <DxColumn :visible="false" data-field="IsActivated" data-type="boolean" />
      <DxColumn :width="125" data-field="StateId" caption="State">
        <DxLookup
          :data-source="states"
          value-expr="Id"
          display-expr="StateName"
        />
      </DxColumn>
    </DxDataGrid>
  </div>
</template>
<script>
import {
  DxDataGrid,
  DxColumn,
  DxPaging,
  DxEditing,
  DxPopup,
  DxLookup,
  DxForm,
} from "devextreme-vue/data-grid";
import { DxItem } from "devextreme-vue/form";
import DxRadioGroup from "devextreme-vue/radio-group";
import { CommonUtility } from "../js/crud";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxPaging,
    DxEditing,
    DxPopup,
    DxLookup,
    DxForm,
    DxItem,
    DxRadioGroup,
  },
  data() {
    return {
      userList: [],
      states: [],
      AddUpdateUser: {},
      genderValues: [
        { id: "M", text: "Male" },
        { id: "F", text: "Female" },
      ],
      commonUtility: new CommonUtility(),
      selectedGender: "",
      selectedId: 0,
      dataGridInstance: null,
    };
  },
  methods: {
    radioChanged(e) {
      this.userList.forEach((key) => {
        debugger;
        if (key.Id == this.selectedId) {
          key.Gender = e.value;
        }
      });
    },
    logEvent(e) {
      this.selectedGender = e.data.Gender;
      this.selectedId = e.data.Id;
    },
    endEdit(e) {
      debugger;
      console.log(e);
    },
    async getUsers() {
      const response = await this.commonUtility.getData("Registration");
      const data = await response.json();
      this.userList = data.data;
    },
    async getStates() {
      const response = await this.commonUtility.getData("StatesMaster");
      const data = await response.json();
      this.states = data.data;
    },
    async updateRow(e) {
      debugger;
      this.AddUpdateUser.Name =
        e.newData.Name == undefined ? e.oldData.Name : e.newData.Name;
      this.AddUpdateUser.City =
        e.newData.City == undefined ? e.oldData.City : e.newData.City;
      this.AddUpdateUser.DOB =
        e.newData.DOB == undefined ? e.oldData.DOB : e.newData.DOB;
      this.AddUpdateUser.StateId =
        e.newData.StateId == undefined ? e.oldData.StateId : e.newData.StateId;
      this.AddUpdateUser.Gender =
        this.selectedGender == undefined
          ? e.oldData.Gender
          : this.selectedGender;
      //e.newData.Gender == undefined ? e.oldData.Gender : e.newData.Gender;

      const response = await this.commonUtility.updateRecord(
        "Registration",
        this.AddUpdateUser,
        e.oldData.Id
      );
      await response.json();
    },
    async addRow(e) {
      debugger;
      this.AddUpdateUser.Name = e.data.Name;
      this.AddUpdateUser.City = e.data.City;
      this.AddUpdateUser.DOB = e.data.DOB;
      this.AddUpdateUser.StateId = e.data.StateId;
      this.AddUpdateUser.Gender = e.data.Gender;
      const response = await this.commonUtility.insertRecord(
        "Registration",
        this.AddUpdateUser
      );
      await response.json();
    },
  },
  mounted: function () {
    this.getStates();
    this.getUsers();
  },
};
</script>
<style>
#data-grid-demo {
  min-height: 700px;
}
</style>
