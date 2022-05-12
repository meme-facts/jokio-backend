import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class templates1652137981649 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'templates',
                columns: [
                    {
                        name:'id',
                        type: 'uuid',
                        isPrimary:true
                    },
                    {
                        name: 'title',
                        type: 'varchar',
                    },
                    {
                        name: 'templateDescription',
                        type: 'varchar'
                    },
                    {
                        name: 'imgUrl',
                        type: 'varchar'
                    }, 
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()'
                    },
                    
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('templates')
    }

}
