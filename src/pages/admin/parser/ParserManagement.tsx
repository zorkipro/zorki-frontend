import React from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ParserControls } from "@/components/admin/ParserControls";
import ParserAccountsManagement from "../parser-accounts/ParserAccountsManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui-kit";
import { Play, Database } from "lucide-react";

const ParserManagement: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <AdminHeader />
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="controls" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 gap-2 lg:w-auto">
            <TabsTrigger value="controls" className="flex items-center space-x-2">
              <Play className="w-4 h-4" />
              <span>Управление парсерами</span>
            </TabsTrigger>
            <TabsTrigger value="accounts" className="flex items-center space-x-2">
              <Database className="w-4 h-4" />
              <span>Аккаунты парсера</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="controls" className="space-y-6">
            <ParserControls />
          </TabsContent>

          <TabsContent value="accounts" className="space-y-6">
            <ParserAccountsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ParserManagement;
