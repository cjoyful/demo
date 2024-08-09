<template>
  <div class="profileClass">
    <div class="header">
      <Header>Profile</Header>
      <a-button
        type="primary"
        @click="changeState"
        size="small"
        style="margin-left: 10px"
      >
        <template #icon>
          <EditOutlined />
        </template>
        编辑
      </a-button>
    </div>
    <a-form
      :rules="rules"
      :model="formState"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-item label="用户名">
        <a-input v-model:value="formState.userName" v-if="isEdit" />
        <span v-else>{{ formState.userName }}</span>
      </a-form-item>
      <a-form-item label="邮箱">
        <a-input v-model:value="formState.email" v-if="isEdit" />
        <span v-else>{{ formState.email }}</span>
      </a-form-item>
      <a-form-item label="手机号">
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
  import { reactive, toRaw, ref } from "vue";
  import { EditOutlined } from "@ant-design/icons-vue";
  import type { UnwrapRef } from "vue";
  import type { Rule } from "ant-design-vue/es/form";

  const isEdit = ref(false);
  const changeState = () => {
    isEdit.value = !isEdit.value;
  };

  interface FormState {
    userName: string;
    email: string;
    phone: string;
  }
  const formState: UnwrapRef<FormState> = reactive({
    userName: "张三",
    email: "zhangsan@163.com",
    phone: "18622222222",
  });
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
    userName: [{ required: true, validator: checkName, trigger: "change" }],
    email: [{ required: true, validator: checkEmail, trigger: "change" }],
    phone: [{ required: true, validator: checkPhone, trigger: "change" }],
  };
  //
  const onSubmit = () => {
    console.log("submit!", toRaw(formState));
  };
  const labelCol = { style: { width: "150px" } };
  const wrapperCol = { span: 10 };

  //
  //import sqlite3 from 'sqlite3';
  const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./mydb.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the mydb.db database.');
  }
});

    // 打开或创建数据库
    //const db = await open({
    //  filename: './database.db',
    //  driver: require('sqlite3').Database
    //});
 
    // 创建表
    //await db.run('CREATE TABLE IF NOT EXISTS people (id INTEGER PRIMARY KEY, name TEXT)');
 
    // 插入数据
    //await db.run('INSERT INTO people (name) VALUES (?)', 'Vue3 User');
 
    // 查询数据
    //const rows = await db.all('SELECT id, name FROM people');
    //console.log(rows);
 
    // 关闭数据库
    //db.close();


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

