import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class addColumnUserAvatar1649183362794 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "comments",
      new TableColumn({
        name: "updated_at",
        type: "timestamp",
        default: "now()",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("comments", "updated_at");
  }
}
