<template>
  <div id="data-grid-demo">
    <DxDataGrid
      :ref="dataGridRef"
      :data-source="userList"
      :show-borders="true"
      key-expr="Id"
      @row-inserting="addRow"
      @editing-start="editingStart"
      @Saving="updateRecord"
      @exporting="onExporting"
    >
      <DxToolbar>
        <DxItem location="after">
          <DxDropDownButton
            :items="downloads"
            :drop-down-options="{ width: 230 }"
            text="Export"
            icon="download"
            @item-click="onItemClick"
            class="buttoncenter"
          />
        </DxItem>
        <DxItem location="before" template="groupingTemplate" />
        <DxItem location="before" template="groupingTemplate1" />
        <DxItem location="before" template="refreshTemplate" />
        <DxItem name="addRowButton" class="buttoncenter" />
      </DxToolbar>
      <template #groupingTemplate>
        <span>From Date</span>
        <DxDateBox :value="now" type="date" width="200" />
      </template>
      <template #groupingTemplate1>
        <span>To Date</span>
        <DxDateBox :value="now" type="date" width="200" />
      </template>
      <template #refreshTemplate>
        <DxButton
          icon="search"
          @click="refreshDataGrid"
          text="Search"
          class="buttoncenter"
        />
      </template>
      <DxFilterRow :visible="true" />
      <DxPaging :enabled="true" :page-size="10" :page-index="1" />
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
          title="Employee Information 123"
        />
        <DxForm :show-colon-after-label="true">
          <DxItem :col-count="2" :col-span="2" item-type="group">
            <DxItem data-field="Name">
              <DxRequiredRule message="Name is required" />
            </DxItem>
            <DxItem data-field="City" />
            <DxItem data-field="DOB">
              <DxRequiredRule message="DOB is required" />
            </DxItem>
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
            <DxItem data-field="StateId">
              <DxRequiredRule message="State is required" />
            </DxItem>
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
import DxDropDownButton from "devextreme-vue/drop-down-button";
import DxButton from "devextreme-vue/button";
import DxDateBox from "devextreme-vue/date-box";
//import DxFilterBuilder from "devextreme-vue/filter-builder";
import {
  DxDataGrid,
  DxColumn,
  DxPaging,
  DxEditing,
  DxPopup,
  DxLookup,
  DxForm,
  DxFilterRow,
  DxToolbar,
} from "devextreme-vue/data-grid";
import { DxRequiredRule, DxItem } from "devextreme-vue/form";
import DxRadioGroup from "devextreme-vue/radio-group";
import { CommonUtility } from "../js/crud";
import { fields, filter } from "../js/data1";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { exportDataGrid as exportDataGridToPdf } from "devextreme/pdf_exporter";

import { Workbook } from "exceljs";
import { saveAs } from "file-saver-es";
import { exportDataGrid } from "devextreme/excel_exporter";

const dataGridRef = "dataGrid";
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
    DxRequiredRule,
    DxFilterRow,
    DxToolbar,
    DxButton,
    DxDateBox,
    DxDropDownButton,
  },
  data() {
    return {
      downloads: ["Export To PDF", "Export To Excel"],
      filter,
      fields,
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
      selectedRow: null,
      dataGridRef,
    };
  },
  computed: {
    dataGrid() {
      return this.$refs[dataGridRef].instance;
    },
  },
  methods: {
    onItemClick(e) {
      if (e.itemData === "Export To PDF") {
        this.exportGridToPDF();
      } else {
        this.exportGridToExcel();
      }
    },
    exportGridToExcel() {
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet("Employees");

      exportDataGrid({
        component: this.dataGrid,
        worksheet,
        autoFilterEnabled: true,
      }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(
            new Blob([buffer], { type: "application/octet-stream" }),
            "UserList.xlsx"
          );
        });
      });
    },
    exportGridToPDF() {
      const doc = new jsPDF("p", "pt", "a4");
      exportDataGridToPdf({
        jsPDFDocument: doc,
        component: this.dataGrid,
      }).then(() => {
        doc.setFontSize(25);
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          const pageSize = doc.internal.pageSize;
          const pageWidth = pageSize.width
            ? pageSize.width
            : pageSize.getWidth();
          const pageHeight = pageSize.height
            ? pageSize.height
            : pageSize.getHeight();
          const header = "Report 2014";
          const footer = `Page ${i} of ${pageCount}`;

          // Header
          doc.text(header, 50, 0, { baseline: "top" });

          // Footer
          doc.text(
            footer,
            pageWidth / 2 - doc.getTextWidth(footer) / 2,
            pageHeight,
            { baseline: "bottom" }
          );
        }
        doc.save("UserList.pdf");
      });
    },
    radioChanged(e) {
      this.selectedGender = e.value;
    },
    editingStart(e) {
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
.dx-datagrid-header-panel {
  padding: 10;
}

.dx-datagrid-header-panel .dx-toolbar {
  margin: 0;
  padding-right: 20px;
  background-color: transparent;
}

.dx-datagrid-header-panel .dx-toolbar-items-container {
  height: 100px;
}

.buttoncenter {
  margin-top: 20px;
}
.dx-datagrid-addrow-button {
  margin-top: 20px;
}
</style>
