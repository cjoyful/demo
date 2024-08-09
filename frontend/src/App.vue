<template>
  <div class="profileClass">
    <div class="header">
      <Header>Profile</Header>
      <a-button
        type="primary"
        @click="changeState"
        size="small"
        style="margin-left: 10px"
        v-if="!isEdit"
      >
        <template #icon>
          <EditOutlined />
        </template>
        <span>编辑</span>
      </a-button>
    </div>
    <a-form
      ref="formRef"
      :rules="rules"
      :model="formState"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-item label="用户名" required name="userName">
        <a-input v-model:value="formState.userName" v-if="isEdit" />
        <span v-else>{{ formState.userName }}</span>
      </a-form-item>
      <a-form-item label="邮箱" required name="email">
        <a-input v-model:value="formState.email" v-if="isEdit" />
        <span v-else>{{ formState.email }}</span>
      </a-form-item>
      <a-form-item label="手机号" required name="phone">
        <a-input v-model:value="formState.phone" v-if="isEdit" />
        <span v-else>{{ formState.phone }}</span>
      </a-form-item>
      <a-form-item style="margin-left: 150px" v-if="isEdit">
        <a-button type="primary" @click="onSubmit">确定</a-button>
        <a-button style="margin-left: 10px" @click="changeState">取消</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, toRaw, ref, onMounted } from "vue";
  import { message } from "ant-design-vue";
  import { EditOutlined } from "@ant-design/icons-vue";
  import type { UnwrapRef } from "vue";
  import type { Rule } from "ant-design-vue/es/form";

  const isEdit = ref(false);
  const formRef = ref();
  interface FormState {
    id: number;
    userName: string;
    email: string;
    phone: string;
  }
  const formState: UnwrapRef<FormState> = reactive({
    id: 0,
    userName: "",
    email: "",
    phone: "",
  });
  // 从数据库加载的原始数据
  let originData: UnwrapRef<FormState> = {
    id: 0,
    userName: "",
    email: "",
    phone: "",
  };
  const changeState = () => {
    isEdit.value = !isEdit.value;
    if (!isEdit.value) {
      // 取消后数据还原到原始
      formState.userName = originData.userName;
      formState.email = originData.email;
      formState.phone = originData.phone;
    }
  };
  const checkPhone = async (_rule: Rule, value: string) => {
    if (!value) {
      return Promise.reject("请输入手机号!");
    } else {
      const regex = /^1(3[0-9]|4[5-9]|5[0-35-9]|7[0-9]|8[0-9])\d{8}$/; // 匹配手机号格式的正则表达式
      const match = value.match(regex); // 使用match方法进行匹配
      if (match) {
        // 如果匹配成功
        return Promise.resolve();
      } else {
        return Promise.reject("请输入正确的手机号!");
      }
    }
  };
  const checkEmail = async (_rule: Rule, value: string) => {
    if (!value) {
      return Promise.reject("请输入邮箱!");
    } else {
      const regex =
        /^[a-zA-Z0-9_-]+(\+[a-zA-Z0-9_-]+)?@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/; // 匹配邮箱格式的正则表达式
      const match = value.match(regex); // 使用match方法进行匹配
      if (match) {
        // 如果匹配成功
        return Promise.resolve();
      } else {
        return Promise.reject("请输入正确的邮箱!");
      }
    }
  };
  const checkName = async (_rule: Rule, value: string) => {
    if (!value) {
      return Promise.reject("请输入姓名!");
    } else {
      if (value.length < 3 || value.length > 20) {
        return Promise.reject("姓名长度在3到20之间!");
      } else {
        return Promise.resolve();
      }
    }
  };
  const rules: Record<string, Rule[]> = {
    userName: [
      { required: true, type: "string", validator: checkName, trigger: "change" },
    ],
    email: [
      {
        required: true,
        type: "string",
        validator: checkEmail,
        trigger: "change",
      },
    ],
    phone: [
      {
        required: true,
        type: "string",
        validator: checkPhone,
        trigger: "change",
      },
    ],
  };

  // 设置数据
  const setData = (data: FormState) => {
    originData.id = data.id;
    originData.userName = data.userName;
    originData.email = data.email;
    originData.phone = data.phone;
    formState.id = data.id;
    formState.userName = data.userName;
    formState.email = data.email;
    formState.phone = data.phone;
  };

  onMounted(() => {
    getProfile((errors: string[], result: FormState) => {
      if (errors.length > 0) {
        console.log(errors);
      } else {
        setData(result);
      }
    });
  });
  const onSubmit = () => {
    formRef.value
      .validate()
      .then(() => {
        updateProfile((errors: string[]) => {
          if (errors.length > 0) {
            console.log(errors);
          } else {
            setData(toRaw(formState));
            message.success("修改成功");
          }
        });
      })
      .catch((error) => {
        console.log("error", error);
      });
    //
  };
  //获取profile信息接口
  const getProfile = function (callback: any) {
    const request = new XMLHttpRequest();
    request.open("GET", "http://localhost:3000/profiles");
    request.send();
    request.addEventListener("load", () => {
      const status = request.status;
      switch (status) {
        case 200:
          const bodyAsString = request.responseText;
          const profiles = JSON.parse(bodyAsString);
          callback([], profiles);
          break;
        case 500:
          callback(["Server error"]);
          break;
        default:
          callback(["Server error"]);
      }
    });
  };
  //更新profile信息接口
  const updateProfile = function (callback: any) {
    const request = new XMLHttpRequest();
    request.open("PUT", "http://localhost:3000/profiles/" + formState.id);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(toRaw(formState)));
    request.addEventListener("load", () => {
      const status = request.status;
      switch (status) {
        case 200:
          callback([]);
          break;
        case 400:
          const errors = JSON.parse(request.responseText);
          callback(errors);
          break;
        case 500:
          callback(["Unknown server error"]);
          break;
        default:
          callback(["Unknown server error"]);
      }
    });
  };
  const labelCol = { style: { width: "150px" } };
  const wrapperCol = { span: 10 };
</script>

<style scoped>
  .profileClass {
    padding: 20px;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 20px;
  }
</style>

