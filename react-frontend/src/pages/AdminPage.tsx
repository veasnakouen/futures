import React, { useState } from 'react';
import { Tabs, TabItem } from 'flowbite-react';
import Layout from '../components/Layout';
import UserManagement from '../components/admin/UserManagement';
import RoleManagement from '../components/admin/RoleManagement';
import { Users, ShieldCheck } from 'lucide-react';

interface AdminPageProps {
  isDark: boolean;
  setIsDark: (v: boolean) => void;
}

const AdminPage = ({ isDark, setIsDark }: AdminPageProps) => {
  return (
    <Layout isDark={isDark} setIsDark={setIsDark} title="System Administration">
      <div className="max-w-7xl mx-auto">
        <Tabs aria-label="Admin settings" variant="underline">
          <TabItem active title="User Access Control" icon={Users}>
            <div className="mt-8">
              <UserManagement />
            </div>
          </TabItem>
          <TabItem title="Role Permissions" icon={ShieldCheck}>
            <div className="mt-8">
              <RoleManagement />
            </div>
          </TabItem>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminPage;
