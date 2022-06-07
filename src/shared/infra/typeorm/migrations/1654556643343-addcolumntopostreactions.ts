import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class addcolumntopostreactions1654556643343
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "postReactions",
      new TableColumn({
        name: "updated_at",
        type: "timestamp",
        default: "now()",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("postReactions", "updated_at");
  }
}
