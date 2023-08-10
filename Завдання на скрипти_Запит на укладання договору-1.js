//Скрипт 1. Передача результату опрацювання документа в ESIGN
function onTaskExecuteCheckDirectory(routeStage) {
  debugger;
  var signatures = [];
  var command;
  if (routeStage.executionResult == "executed") {
    command = "CompleteTask";
    signatures = EdocsApi.getSignaturesAllFiles();
  } else {
    command = "RejectTask";
  }
  var DocCommandData = {};

  DocCommandData.extSysDocID = CurrentDocument.id;
  DocCommandData.extSysDocVersion = CurrentDocument.version;
  DocCommandData.command = command;
  DocCommandData.legalEntityCode = EdocsApi.getAttributeValue("EDRPOUOrg").value;
  DocCommandData.userEmail = EdocsApi.getEmployeeDataByEmployeeID(CurrentUser.employeeId).email;
  DocCommandData.userTitle = CurrentUser.fullName;
  DocCommandData.comment = routeStage.comment;
  DocCommandData.signatures = signatures;

  routeStage.externalAPIExecutingParams = {
    externalSystemCode: "ESIGN1", // код зовнішньої системи
    externalSystemMethod: "integration/processDocCommand", // метод зовнішньої системи
    data: DocCommandData, // дані, що очікує зовнішня система для заданого методу
    executeAsync: false, // виконувати завдання асинхронно
  };
}

function onTaskExecuteMainTask(routeStage) {
  debugger;
  var signatures = [];
  var command = "RejectTask";
  if (CurrentDocument.inExtId) {
    if (routeStage.executionResult == "rejected") {
      var DocCommandData = {};

      DocCommandData.extSysDocID = CurrentDocument.id;
      DocCommandData.extSysDocVersion = CurrentDocument.version;
      DocCommandData.command = command;
      DocCommandData.legalEntityCode = EdocsApi.getAttributeValue("EDRPOUOrg").value;
      DocCommandData.userEmail = EdocsApi.getEmployeeDataByEmployeeID(CurrentUser.employeeId).email;
      DocCommandData.userTitle = CurrentUser.fullName;
      DocCommandData.comment = routeStage.comment;
      DocCommandData.signatures = signatures;

      routeStage.externalAPIExecutingParams = {
        externalSystemCode: "ESIGN1", // код зовнішньої системи
        externalSystemMethod: "integration/processDocCommand", // метод зовнішньої системи
        data: DocCommandData, // дані, що очікує зовнішня система для заданого методу
        executeAsync: false, // виконувати завдання асинхронно
      };
    }
  }
}

//Скрипт 2. Зміна властивостей атрибутів при створені документа
function setInitialRequired() {
  if (CurrentDocument.inExtId) {
    controlRequired("edocsIncomeDocumentNumber");
    controlRequired("edocsIncomeDocumentDate");
    controlRequired("TelephoneContactPerson");
  }
}

function controlRequired(CODE, required = true) {
  const control = EdocsApi.EdocsApi.getControlProperties(CODE);
  control.required = required;
  EdocsApi.EdocsApi.getControlProperties(control);
}

function onCardInitialize() {
  setInitialRequired();
  CheckDirectoryTask();
}

//Скрипт 3. Неможливість внесення змін в поля карточки
function CheckDirectoryTask() {
  const stateTask = EdocsApi.getCaseTaskDataByCode("CheckDirectory").state;
  if (stateTask == "assigned" || stateTask == "inProgress" || stateTask == "completed'") {
    controlDisabled("edocsIncomeDocumentNumber");
    controlDisabled("edocsIncomeDocumentDate");
    controlDisabled("TelephoneContactPerson");
    controlDisabled("Comment");
  } else {
    controlDisabled("edocsIncomeDocumentNumber", false);
    controlDisabled("edocsIncomeDocumentDate", false);
    controlDisabled("TelephoneContactPerson", false);
    controlDisabled("Comment", false);
  }
}

function controlDisabled(CODE, disabled = true) {
  const control = EdocsApi.getControlProperties(CODE);
  control.disabled = disabled;
  EdocsApi.setControlProperties(control);
}
