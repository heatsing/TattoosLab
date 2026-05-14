import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  @Get("health")
  getHealth() {
    return {
      success: true,
      message: "Nest API is healthy.",
      timestamp: new Date().toISOString(),
    };
  }
}