<template>
  <div id="data-grid-demo">
    <DxDataGrid
      :data-source="userList"
      :show-borders="true"
      key-expr="Id"
      @row-inserting="addRow"
      @editing-start="editingStart"
      @Saving="updateRecord"
    >
      <DxFilterRow :visible="true" />
      <DxPaging :enabled="true" :page-size="2" :page-index="1"  />
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
      <DxColumn :width="110" type="buttons">
        <DxButton :on-click="customEdit" hint="Edit" icon="edit" />
      </DxColumn>
    </DxDataGrid>
  </div>
</template>
<script>
import {
  DxDataGrid,
  DxColumn,
  DxPaging,
  DxLookup,
  DxButton,
  DxFilterRow
} from "devextreme-vue/data-grid";
import { CommonUtility } from "../js/crud";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxPaging,
    DxLookup,
    DxButton,
    DxFilterRow
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
      selectedGender: null,
      selectedId: 0,
      dataGridInstance: null,
      selectedRow: null,
    };
  },
  props: {
    showInfo: {
      type: Function,
      required: true,
      default: () => {},
    },
  },
  methods: {
    customEdit(e) {
      const result = this.userList.find((t) => t.Id == e.row.key);
      this.showInfo(result,this.states);
    },
    radioChanged(e) {
      this.selectedGender = e.value;
    },
    editingStart(e) {
        debugger;
      this.selectedRow = e.data;
      this.selectedGender = e.data.Gender;
      this.selectedId = e.data.Id;
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
    async updateRecord(e) {
      this.userList.forEach((key) => {
        if (key.Id == this.selectedId) {
          key.Gender = this.selectedGender;
        }
      });

      const result = this.userList.find((t) => t.Id == this.selectedId);
      this.AddUpdateUser.Name =
        e.changes.length > 0 && e.changes[0].data.Name != undefined
          ? e.changes[0].data.Name
          : result.Name;
      this.AddUpdateUser.City =
        e.changes.length > 0 && e.changes[0].data.City != undefined
          ? e.changes[0].data.City
          : result.City;
      this.AddUpdateUser.DOB =
        e.changes.length > 0 && e.changes[0].data.DOB != undefined
          ? e.changes[0].data.DOB
          : result.DOB;
      this.AddUpdateUser.StateId =
        e.changes.length > 0 && e.changes[0].data.StateId != undefined
          ? e.changes[0].data.StateId
          : result.StateId;
      this.AddUpdateUser.Gender = this.selectedGender;
      const response = await this.commonUtility.updateRecord(
        "Registration",
        this.AddUpdateUser,
        this.selectedRow.Id
      );
      await response.json();
    },

    async addRow(e) {
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
