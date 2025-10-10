import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { AdminService } from '../services/admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('plans')
  getPlans() {
    return this.adminService.listPlans();
  }

  @Patch('plans/:planId')
  updatePlan(@Param('planId') planId: string, @Body('monthlyCredits') monthlyCredits: number) {
    return this.adminService.updatePlan(planId, monthlyCredits);
  }

  @Get('credits')
  getCreditMap() {
    return this.adminService.listCreditCosts();
  }

  @Patch('credits/:modelCode')
  updateCredit(@Param('modelCode') modelCode: string, @Body('cost') cost: number) {
    return this.adminService.updateCreditCost(modelCode, cost);
  }
}
